import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BlindModalPage} from "../modal/blind.modal.page";
import {callService} from "home-assistant-js-websocket";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'blinds-tile',
  templateUrl: './blinds-tile.component.html',
  styleUrls: ['./blinds-tile.component.scss'],
})
export class BlindsTileComponent implements OnInit, OnChanges {
  @Input() entity: any;
  @Input() entities: any;
  @Input() connection: any;
  math = Math;

  constructor(public modalController: ModalController) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.entity = changes['entity'].currentValue;
    }
    if (changes['entities']) {
      this.entities = changes['entities'].currentValue;

    }
    if (changes['connection']) {
      this.connection = changes['connection'].currentValue;
    }
  }

  ngOnInit() {}

  hold(entity) {
    console.log('hold');
    this.blindModal(entity);
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
    console.log(modal);
    await modal.present();

    console.log('presented');
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
