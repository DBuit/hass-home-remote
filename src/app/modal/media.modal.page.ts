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
    inGroup: any = {};
    loading: boolean = false;

    constructor(public modalController: ModalController) {
    }

    ngOnInit() {
        this.volume = this.entityData.attributes.volume_level * 100;
        subscribeEntities(this.connection, entities => {
            this.entityData = entities[this.entity.entity];
            this.init();
        });
        this.init();
    }

    init() {
        this.loading = false;
        this.volume = this.entityData.attributes.volume_level * 100;

        if (this.entity.group) {
            this.inGroup = {};
            for (const speaker of this.entityData.attributes.sonos_group) {
                if (speaker !== this.entity.entity) {
                    this.inGroup[speaker] = true;
                }
            }
        }


    }

    getThumbnail() {
        // callService(this.connection, "homeassistant", "toggle", {
        //     entity_id: entity
        // });
    }

    dismissModal($event = null) {
        if (!$event || ($event.target.className === 'modal-page' || $event.target.localName === 'ion-toolbar')) {
            this.modalController.dismiss();
        }
    }

    //Set favorite as source
    setSource() {
        //select_source
    }

    // Join player
    joinPlayer(speakerEntity) {
        console.log('join', speakerEntity);
        callService(this.connection, 'sonos', 'join', {
            master: this.entity.entity,
            entity_id: speakerEntity
        });
        this.loading = true;
    }

    // Unjoin player
    unjoinPlayer(speakerEntity) {
        console.log('unjoin', speakerEntity);
        callService(this.connection, 'sonos', 'unjoin', {
            entity_id: speakerEntity
        });
        this.loading = true;
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

    updateVolume(volume) {
      let volumeFloat = volume/100;

      callService(this.connection, 'media_player', 'volume_set', {
          entity_id: this.entity.entity,
          volume_level: volumeFloat
      });

      for(let speakerEntity in this.inGroup) {
        callService(this.connection, 'media_player', 'volume_set', {
            entity_id: speakerEntity,
            volume_level: volumeFloat
        });
      }
    }
}
