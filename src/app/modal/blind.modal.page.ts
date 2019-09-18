import {Component, Input, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'blind-modal-page.html',
    styleUrls: ['blind-modal-page.scss'],
    selector: 'blind-modal-page',
})
export class BlindModalPage {

    @Input() entity: any;
    @Input() entities: any;
    @Input() connection: any;
    value: number = 0;

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        for(let i = 0; i< 3;i++) {
            let active = true;
            for(let j in this.entity.entities) {
                let state = parseInt(this.entities[this.entity.entities[j].entity].state);
                let position = parseInt(this.entity.entities[j].positions[i]);
                if(state < (position -5) || state > (position + 5)) {
                    active = false;
                }
            }

            if(active) {
                this.value = i;
            }
        }
    }

    update(value) {
        this.value = value;
        for(let entity of this.entity.entities) {
            callService(this.connection, "input_number", "set_value", {
                entity_id: entity.entity,
                value: entity.positions[this.value]
            });
        }
    }

    dismissModal() {
        this.modalController.dismiss();
    }

}