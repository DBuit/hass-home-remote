import {Component, Input, SimpleChange, SimpleChanges} from '@angular/core';
import { callService, Connection } from 'home-assistant-js-websocket';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'media-modal-page.html',
    styleUrls: ['media-modal-page.scss'],
    selector: 'media-modal-page',
})
export class MediaModalPage  {

    @Input() entity: any;
    @Input() entityData: any;
    @Input() connection: any;

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {

    }



    dismissModal() {
        this.modalController.dismiss();
    }

}
