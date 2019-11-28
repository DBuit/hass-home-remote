import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {callService} from 'home-assistant-js-websocket';
import {BrightnessModalPage} from '../modal/brightness.modal.page';
import {SwitchModalPage} from '../modal/switch.modal.page';
import {ModalController} from '@ionic/angular';
import {MediaModalPage} from '../modal/media.modal.page';

@Component({
  selector: 'tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss'],
})
export class TileComponent implements OnInit, OnChanges {

  @Input() entity: any;
  @Input() entityData: any;
  @Input() connection: any;
  math = Math;

  constructor(public modalController: ModalController) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.entity = changes['entity'].currentValue;
    }
    if (changes['entityData']) {
      this.entityData = changes['entityData'].currentValue;
    }
    if (changes['connection']) {
      this.connection = changes['connection'].currentValue;
    }
  }

  ngOnInit() {}

  hold(entity) {
    console.log('hold');
    if (entity.type === 'light') {
      this.brightnessModal(entity);
    } else if (entity.type === 'switch' || entity.type === 'input_boolean') {
      this.switchModal(entity);
    } else if (entity.type === 'media_player') {
      this.mediaModal(entity);
    }
  }

  toggle(entity) {
    console.log('tap');
    callService(this.connection, 'homeassistant', 'toggle', {
      entity_id: entity
    });
  }

  calculateTime(lastUpdated) {
    const currentDate = new Date();
    const lastDate = new Date(lastUpdated);

    const diffMs = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffMs / 86400000); // days
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    const diffSecs = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000);

    if (diffDays > 0) {
      return diffDays + ' days ago';
    } else if (diffHrs > 0) {
      return diffHrs + ' hours ago';
    } else if (diffMins > 0) {
      return diffMins + ' minutes ago';
    } else {
      return diffSecs + ' seconds ago';
    }
  }

  async brightnessModal(entity: any) {
    const modal = await this.modalController.create({
      component: BrightnessModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        entity: entity,
        entityData: this.entityData,
        connection: this.connection
      }
    });
    await modal.present();
  }

  async switchModal(entity: any) {
    const modal = await this.modalController.create({
      component: SwitchModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        entity: entity,
        entityData: this.entityData,
        connection: this.connection
      }
    });
    await modal.present();
  }

  async mediaModal(entity: any) {
    const modal = await this.modalController.create({
      component: MediaModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        entity: entity,
        entityData: this.entityData,
        connection: this.connection
      }
    });
    await modal.present();
  }

}
