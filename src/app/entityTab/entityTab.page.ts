import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeEntities, getStates } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';
import { WebsocketService } from "../service/websocket.service";
import { SettingsService } from "../service/settings.service";
import { WeatherService } from '../service/weather.service';
import { TranslatePipe } from '../pipe/translate.pipe';
import * as moment from 'moment';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-entitytab',
  templateUrl: 'entityTab.page.html',
  styleUrls: ['entityTab.page.scss']
})
export class EntityTabPage {
  configuration: any;
  entities: any;
  setup: any[] = [];
  connection: any;
  loading: boolean = true;
  index: string;
  home: boolean = false;
  unusedEntitiesForStats: any[] = [];
  title: string;
  homeStats: any = {
    light: null,
    media_player: null,
    today: {
      notes: [],
      calendar: []
    },
    tomorrow: {
      notes: [],
      calendar: []
    },
    other: {
      notes: [],
      calendar: []
    }
  };
  weather: any = null;
  calendar: string;
  isRenderingCalendar = false;

  // tslint:disable-next-line: max-line-length
  constructor(public modalController: ModalController, private route: ActivatedRoute, private router: Router, public webSocketService: WebsocketService, public settingsService: SettingsService, public weatherService: WeatherService, private translatePipe: TranslatePipe, public toastService: ToastService) {}

  async checkSettings() {
    const url = await this.settingsService.get('url');
    const token = await this.settingsService.get('token');
    const longTokenEnabled = await this.settingsService.get('longTokenEnabled');
    return !(!url || (!token && longTokenEnabled !== false));
  }

  async ngOnInit() {
    if (await this.checkSettings()) {
      this.connect();
      this.index = this.route.snapshot.paramMap.get('index');
      this.configuration = await this.settingsService.get('configuration');
      this.setup = this.configuration[this.index].content;

      this.weather = this.configuration[0].weather;
      if (this.configuration[this.index].type && this.configuration[this.index].type == 'home') {
        this.home = true;
        this.unusedEntitiesForStats = this.configuration[this.index].unusedEntitiesForStats;
        if (this.configuration[this.index].title) {
          this.title =  this.configuration[this.index].title;
        } else {
          this. title = this.configuration[this.index].name;
        }

        if (this.configuration[this.index].calendar) {
          this.calendar = this.configuration[this.index].calendar;
        }
      }

    } else {
      await this.router.navigate(['/tabs/settings/tab']);
    }
  }

  isToday(calendarItem) {
    const today = moment();
    const date = calendarItem.start.dateTime ? calendarItem.start.dateTime : calendarItem.start.date;
    return moment(date).isSame(today, 'month') && moment(date).isSame(today, 'day') ? true : false;
  }


  renderCalendar() {
    if(!this.isRenderingCalendar) {
      this.isRenderingCalendar = true;
      const startDaysAhead = 0;
      const maxDaysToShow = 2;
      const timeOffset = -moment().utcOffset();
      const start = moment().add(startDaysAhead, 'days').startOf('day').add(timeOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
      const end = moment().add((maxDaysToShow + startDaysAhead), 'days').endOf('day').add(timeOffset, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
      const url = 'calendars/' + this.calendar + '?start=' + start + 'Z&end=' + end + 'Z';

      this.webSocketService.apiCall('GET', url).subscribe((res: any) => {
        this.homeStats.today.calendar = [];
        this.homeStats.tomorrow.calendar = [];
        this.homeStats.other.calendar = [];
        for (const calendarItem of res) {
          const item = {
            name: calendarItem.summary,
            locationShort: calendarItem.location ? calendarItem.location.split(',')[0] : null,
            location: calendarItem.location ? calendarItem.location : null,
            date: calendarItem.start.dateTime ? moment(calendarItem.start.dateTime).format('DD MMM') : moment(calendarItem.start.date).format('DD MMM'),
            startTime: calendarItem.start.dateTime ? moment(calendarItem.start.dateTime).format('LT') : null,
            endTime: calendarItem.end.dateTime ? moment(calendarItem.end.dateTime).format('LT') : null,
            today: this.isToday(calendarItem)
          };

          if (item.today) {
            this.homeStats.today.calendar.push(item);
          } else {
            this.homeStats.tomorrow.calendar.push(item);
          }
        }
        this.isRenderingCalendar = false;
      });
    }
  }

  async connect() {
    try {
    this.connection = await this.webSocketService.getConnection();
    } catch (e) {
      this.toastService.sendToast('Ha connection', 'Error making connection', true, false, 0);
    }

    this.loading = false;
    subscribeEntities(this.connection, entities => {
      this.entities = entities;
      if (this.home) {
        let countLight = 0;
        let countMediaplayer = 0;
        for (const key in entities) {
          if (key.includes('light.') && !this.unusedEntitiesForStats.includes(key)) {
            if (entities[key].state == 'on') {
              countLight++;
            }
            if (countLight > 0) {
              this.homeStats.light = countLight + " " + this.translatePipe.transform(countLight > 1 ? "lights" : "light", 'hasskit', 'stats');
            } else {
              this.homeStats.light = null;
            }
          }
          if (key.includes('media_player.') && !this.unusedEntitiesForStats.includes(key)) {
            if (entities[key].state == 'playing') {
              countMediaplayer++;
            }
            if (countMediaplayer > 0) {
              this.homeStats.media_player = countMediaplayer + " " + this.translatePipe.transform(countMediaplayer > 1 ? "media_players" : "media_player", 'hasskit', 'stats');
            } else {
              this.homeStats.media_player = null;
            }
          }
        }

        this.homeStats.today.notes = [];
        this.homeStats.tomorrow.notes = [];
        this.homeStats.other.notes = [];
        for (const note of this.configuration[this.index].notes) {
          // console.log(note);

          // console.log(entities[note.entity]);
          for (const condition of note.conditions) {
            // console.log(condition);
            let conditionState = false;
            switch (condition.type) {
              case 'contains': {
                if (entities[note.entity].state.toLowerCase().includes(condition.check)) {
                  conditionState = true;
                }
                break;
              }
              case 'equals': {
                if (entities[note.entity].state.toLowerCase() === condition.check) {
                  conditionState = true;
                }
                break;
              }
            }
            if (conditionState) {
              this.homeStats[condition.list].notes.push(condition.message);
            }
          }
        }
        console.log(this.homeStats);
        if (this.calendar) {
          this.renderCalendar();
        }
      }
    });
  }

  typeOf(value: any) {
      return typeof value;
  }
}
