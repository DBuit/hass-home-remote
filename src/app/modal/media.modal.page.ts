import {Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges} from '@angular/core';
import {callService, Connection, subscribeEntities} from 'home-assistant-js-websocket';
import { ModalController } from '@ionic/angular';

@Component({
    templateUrl: 'media-modal-page.html',
    styleUrls: ['media-modal-page.scss'],
    selector: 'media-modal-page',
})
export class MediaModalPage implements OnInit {

    @Input() entity: any;
    @Input() entityData: any;
    @Input() connection: any;
    volume: number;

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        this.volume = this.entityData.attributes.volume_level * 100;
        subscribeEntities(this.connection, entities => {
            this.entityData = entities[this.entity.entity];
            this.volume = this.entityData.attributes.volume_level * 100;
        });


    }

    getThumbnail() {
        // callService(this.connection, "homeassistant", "toggle", {
        //     entity_id: entity
        // });
    }

    dismissModal() {
        this.modalController.dismiss();
    }

    //Set favorite as source
    setSource() {
        //select_source
    }

    //Join player
    joinPlayer() {
        //sonos //join
    }

    //Unjoin player
    unjoinPlayer() {
        //sonos //unjoin
    }

    playPauseAction() {
        if (this.entityData.state === 'playing') {
            this.pause();
        } else {
            this.play();
        }
    }

    pause() {
        callService(this.connection, 'media_player', 'media_pause', {
            entity_id: this.entity.entity
        });
    }

    play() {
        callService(this.connection, 'media_player', 'media_play', {
            entity_id: this.entity.entity
        });
    }

    setVolume() {
        //volume_set
    }
}
