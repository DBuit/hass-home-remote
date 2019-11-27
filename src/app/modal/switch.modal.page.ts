import {Component, Input, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from 'home-assistant-js-websocket';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'switch-modal-page.html',
    styleUrls: ['switch-modal-page.scss'],
    selector: 'switch-modal-page',
})
export class SwitchModalPage  {

    @Input() entity: any;
    @Input() entityData: any;
    @Input() connection: any;
    value = 'off';
    values: any = {
        off: 0,
        on: 1
    };
    valuesReverted: any = {
        0: 'off',
        1: 'on'
    };

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        if (this.entityData.state) {
            this.value = this.entityData.state;
        } else {
            this.value = 'off';
        }
    }

    update(value) {
        const type = this.entity.entity.split('.')[0];
        this.value = this.valuesReverted[value];
        console.log(type);
        callService(this.connection, type, 'toggle', {
            entity_id: this.entity.entity
        });
    }

    dismissModal($event = null) {
        if (!$event || ($event.target.className === 'modal-page' || $event.target.localName === 'ion-toolbar')) {
            this.modalController.dismiss();
        }
    }
}
