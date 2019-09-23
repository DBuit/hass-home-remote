import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {callService} from "home-assistant-js-websocket";
import {BrightnessModalPage} from "../modal/brightness.modal.page";
import {SwitchModalPage} from "../modal/switch.modal.page";
import {ModalController} from "@ionic/angular";

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
    if(entity.type == 'light') {
      this.brightnessModal(entity);
    } else if(entity.type == 'switch') {
      this.switchModal(entity);
    }
  }

  toggle(entity) {
    console.log('tap');
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
        'entityData': this.entityData,
        'connection': this.connection
      }
    });
    await modal.present();
  }

  async switchModal(entity) {
    const modal = await this.modalController.create({
      component: SwitchModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        'entity': entity,
        'entityData': this.entityData,
        'connection': this.connection
      }
    });
    await modal.present();
  }



}
