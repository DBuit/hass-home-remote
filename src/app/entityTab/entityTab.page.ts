import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, getAuth, createConnection, subscribeEntities, callService, ConnectionOptions, Connection } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';
import { BrightnessModalPage } from '../modal/brightness.modal.page';
import { WebsocketService } from "../service/websocket.service";
import { SettingsService } from "../service/settings.service";
import {BlindModalPage} from "../modal/blind.modal.page";
import {SwitchModalPage} from "../modal/switch.modal.page";

@Component({
  selector: 'app-entitytab',
  templateUrl: 'entityTab.page.html',
  styleUrls: ['entityTab.page.scss']
})
export class EntityTabPage {
  configuration: any;
  entities: any;
  setup: any[] = [];
  math = Math;
  connection: any;
  loading: boolean = true;
  index: string;

  constructor(public modalController: ModalController, private route: ActivatedRoute, private router: Router, public webSocketService: WebsocketService, public settingsService: SettingsService) {
  }

  async checkSettings() {
    console.log('[checkSettings]');
    let url = await this.settingsService.get('url');
    console.log(url);
    let token = await this.settingsService.get('token');
    console.log(token);
    if(!url || !token) {
      return false;
    } else {
      return true;
    }
  }

  async ngOnInit() {
    console.log('[ngOnInit]');

    if(await this.checkSettings()) {
      this.connect();
      this.index = this.route.snapshot.paramMap.get('index');
      this.configuration = await this.settingsService.get('configuration');
      this.setup = this.configuration[this.index].content;
    } else {
      this.router.navigate(['/tabs/settings/tab']);
    }
  }

  async connect() {
    console.log('[connect]');

    this.connection = await this.webSocketService.getConnection();

    this.loading = false;
    subscribeEntities(this.connection, entities => {
      console.log(entities);
      this.entities = entities;
    });
  }

  hold(entity) {
    console.log("HOLD: ");
    console.log(entity);
    if(entity.type == 'light') {
      this.brightnessModal(entity);
    } else if(entity.type == 'blinds') {
      this.blindModal(entity);
    } else if(entity.type == 'switch') {
      this.switchModal(entity);
    }
  }

  toggle(entity) {
    callService(this.connection, "homeassistant", "toggle", {
      entity_id: entity
    });
  }

  async brightnessModal(entity) {
    const modal = await this.modalController.create({
      component: BrightnessModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        'entity': entity,
        'entities': this.entities,
        'connection': this.connection
      }
    });
    return await modal.present();
  }

  async blindModal(entity) {
    const modal = await this.modalController.create({
      component: BlindModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        'entity': entity,
        'entities': this.entities,
        'connection': this.connection
      }
    });
    return await modal.present();
  }

  async switchModal(entity) {
    const modal = await this.modalController.create({
      component: SwitchModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        'entity': entity,
        'entities': this.entities,
        'connection': this.connection
      }
    });
    return await modal.present();
  }

  blindState(entity) {
    for(let i = 0; i< 3;i++) {
      let active = true;
      for(let j in entity.entities) {
        let state = parseInt(this.entities[entity.entities[j].entity].state);
        let position = parseInt(entity.entities[j].positions[i]);
        if(state < (position -5) || state > (position + 5)) {
          active = false;
        }
      }

      if(active) {
        return i;
      }
    }
    return 'unavailable';
  }
}
