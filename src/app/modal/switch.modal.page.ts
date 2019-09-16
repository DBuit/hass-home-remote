import {Component, Input, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'switch-modal-page.html',
    styleUrls: ['switch-modal-page.scss'],
    selector: 'switch-modal-page',
})
export class SwitchModalPage {

    @Input() entity: any;
    @Input() entities: any;
    @Input() connection: any;
    value: string = 'off';
    values: any = {
        'off': 0,
        'on': 1
    };
    valuesReverted: any = {
        0: 'off',
        1: 'on'
    };

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        if(this.entities[this.entity.entity].state) {
            this.value = this.entities[this.entity.entity].state;
        } else {
            this.value = 'off';
        }
    }

    update(value) {
        this.value = this.valuesReverted[value];
        console.log(this.value);
        callService(this.connection, "input_boolean", "toggle", {
            entity_id: this.entity.entity
        });
    }

    dismissModal() {
        this.modalController.dismiss();
    }

}