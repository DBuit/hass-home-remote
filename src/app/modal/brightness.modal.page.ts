import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from "home-assistant-js-websocket";
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'brightness-modal-page.html',
    styleUrls: ['brightness-modal-page.scss'],
    selector: 'brightness-modal-page',
})
export class BrightnessModalPage implements OnInit {

    @Input() entity: any;
    @Input() entityData: any;
    @Input() connection: any;
    brightness: number = 0;
    sceneRows: number = 0;
    rowLength: number = 4;

    constructor(public modalController: ModalController) { }

    ngOnInit() {
        if(this.entityData.attributes.brightness) {
            this.brightness = Math.round(this.entityData.attributes.brightness / 2.55);
        } else {
            this.brightness = 0;
        }

        if(this.entity.scenes && this.entity.scenes.length > 0) {
            this.sceneRows = Math.ceil(this.entity.scenes.length / this.rowLength);
        }
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

    createRange(number){
        var items: number[] = [];
        for(var i = 0; i < number; i++){
            items.push(i);
        }
        return items;
    }

    activateScene(scene) {
        callService(this.connection, "scene", "turn_on", {
            entity_id: scene
        });
        this.modalController.dismiss();
    }

}