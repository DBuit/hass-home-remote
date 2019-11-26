import {Component, Input, OnInit} from '@angular/core';
import {callService, Connection, subscribeEntities} from 'home-assistant-js-websocket';
import { ModalController } from '@ionic/angular';
import {SettingsService} from '../service/settings.service';

@Component({
    templateUrl: 'camera-modal-page.html',
    styleUrls: ['camera-modal-page.scss'],
    selector: 'camera-modal-page',
})
export class CameraModalPage implements OnInit {

    @Input() entity: any;
    @Input() entityData: any;
    @Input() connection: any;
    url: string;
    streamUrl: string;

    constructor(public modalController: ModalController, public settingsService: SettingsService) {
    }

    ngOnInit() {
        this.init();
    }

    async init() {
        this.url = await this.settingsService.get('url');
        this.streamUrl = this.url + '/api/camera_proxy_stream/camera.camera?token='+this.entityData.attributes.access_token;
    }

    dismissModal($event = null) {
        if (!$event || ($event.target.className === 'modal-page' || $event.target.localName === 'ion-toolbar')) {
            this.modalController.dismiss();
        }
    }
}
