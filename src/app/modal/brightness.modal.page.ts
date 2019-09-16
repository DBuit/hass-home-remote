import {Component, Input, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'brightness-modal-page.html',
    styleUrls: ['brightness-modal-page.scss'],
    selector: 'brightness-modal-page',
})
export class BrightnessModalPage {

    @Input() entity: any;
    @Input() entities: any;
    @Input() connection: any;
    brightness: number = 0;

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        if(this.entities[this.entity.entity].attributes.brightness) {
            this.brightness = Math.round(this.entities[this.entity.entity].attributes.brightness / 2.55);
        } else {
            this.brightness = 0;
        }
        console.log(this.brightness);
    }

    updateBrightness(value) {
        this.brightness = value;

        callService(this.connection, "homeassistant", "turn_on", {
            entity_id: this.entity.entity,
            brightness: this.brightness * 2.55
        });
    }

    dismissModal() {
        this.modalController.dismiss();
    }

}