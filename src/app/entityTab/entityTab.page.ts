import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeEntities } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';
import { WebsocketService } from "../service/websocket.service";
import { SettingsService } from "../service/settings.service";

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
    notes: []
  };

  weather: any = null;
  ICONS = {
    'clear-night': 'clear_night.png',
    cloudy: 'cloudy.png',
    overcast: 'cloudy.png',
    fog: 'fog.png',
    hail: 'mixed_rain.png',
    lightning: 'lightning.png',
    'lightning-rainy': 'storm.png',
    partlycloudy: 'mostly_cloudy.png',
    pouring: 'heavy_rain.png',
    rainy: 'rainy.png',
    snowy: 'snowy.png',
    'snowy-rainy': 'mixed_rain.png',
    sunny: 'sunny.png',
    windy: 'windy.svg',
    'windy-variant': 'windy.svg',
    humidity: 'humidity.svg',
  };
  ICONS_NIGHT = {
    ...this.ICONS,
    sunny: 'clear_night.png',
    partlycloudy: 'mostly_cloudy_night.png',
    'lightning-rainy': 'storm_night.png',
  };
  INFO = {
    precipitation: { icon: 'rainy', unit: 'length' },
    humidity: { icon: 'humidity', unit: '%' },
    wind_speed: { icon: 'windy', unit: 'speed' },
  };

  constructor(public modalController: ModalController, private route: ActivatedRoute, private router: Router, public webSocketService: WebsocketService, public settingsService: SettingsService) {}

  async checkSettings() {
    const url = await this.settingsService.get('url');
    const token = await this.settingsService.get('token');
    return !(!url || !token);
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
      }

    } else {
      await this.router.navigate(['/tabs/settings/tab']);
    }
  }

  async connect() {
    this.connection = await this.webSocketService.getConnection();

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
              this.homeStats.light = countLight + ' lights on';
            } else {
              this.homeStats.light = null;
            }
          }
          if (key.includes('media_player.') && !this.unusedEntitiesForStats.includes(key)) {
            if (entities[key].state == 'playing') {
              countMediaplayer++;
            }
            if (countMediaplayer > 0) {
              this.homeStats.media_player = countMediaplayer + ' speakers are on';
            } else {
              this.homeStats.media_player = null;
            }
          }

        }

        this.homeStats.notes = [];
        for(const note of this.configuration[this.index].notes) {
          //console.log(note);

          //console.log(entities[note.entity]);
          for (const condition of note.conditions) {
            //console.log(condition);
            let conditionState = false;
            switch (condition.type) {
              case 'contains': {
                if (entities[note.entity].state.toLowerCase().includes(condition.check)) {
                  conditionState = true;
                }
                break;
              }
              case 'equals': {
                if (entities[note.entity].state.toLowerCase() == condition.check) {
                  conditionState = true;
                }
                break;
              }
            }
            if(conditionState) {
              this.homeStats.notes.push(condition.message);
            }
          }
        }
      }
    });
  }

  weatherIcon(icon = null) {
    if (!icon) {
      icon = this.entities[this.weather].state.toLowerCase();
    }
    const iconFile = this.isNight() ? this.ICONS_NIGHT[icon] : this.ICONS[icon];

    return 'assets/weather-icons/' + iconFile;
  }

  getUnit(unit = 'temperature') {
    const target = unit === 'speed' ? 'length' : unit;
    if (unit === 'temperature') {
      return '°C';
    } else if (unit === 'length') {
      return 'mm';
    } else if (unit === 'speed') {
      return 'km/h';
    }
    return unit;
  }

  renderExtrema(high: any, low: any) {
    let html = '';
    if (high || low) {
      html += '<span>';
      if (high) {
        html += high + this.getUnit();
      }
      if (high && low) {
        html += ' / ';
      }
      if (low) {
        html += low + this.getUnit();
      }
      html += '</span>';
    }
    return html;
  }

  isNight() {
    if (this.weather && !this.loading && this.entities) {
      return this.entities['sun.sun'] ? this.entities['sun.sun'].state === 'below_horizon' : false;
    }
    return false;
  }

  isCloudy() {
    if (this.weather && !this.loading && this.entities) {
      const weatherState = this.entities[this.weather].state;
      if (weatherState.includes('rain') || weatherState.includes('cloud')) {
        return true;
      }
      return false;
    }
    return false;
  }


}
