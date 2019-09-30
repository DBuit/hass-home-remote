import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {callService} from 'home-assistant-js-websocket';
import { timer } from 'rxjs';
import {ModalController} from '@ionic/angular';
import { SettingsService } from '../service/settings.service';
import {CameraModalPage} from '../modal/camera.modal.page';

@Component({
  selector: 'camera-tile',
  templateUrl: './camera-tile.component.html',
  styleUrls: ['./camera-tile.component.scss'],
})
export class CameraTileComponent implements OnInit, OnChanges {

  @Input() entity: any;
  @Input() entityData: any;
  @Input() connection: any;
  math = Math;
  url: string;
  pictureUrl: string;
  refreshRate: number = 10;

  constructor(public modalController: ModalController, public settingsService: SettingsService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.entity = changes['entity'].currentValue;
    }
    if (changes['entityData']) {
      this.entityData = changes['entityData'].currentValue;
    }
    if (changes['connection']) {
      this.connection = changes['connection'].currentValue;
    }
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.url = await this.settingsService.get('url');
    this.refreshImage();
    this.interval();
  }

  interval() {
    timer(this.refreshRate * 1000, this.refreshRate * 1000).subscribe((res) => {
      console.log('Interval');
      this.refreshImage();
      this.interval();
    });
  }

  refreshImage() {
    console.log('refresh camera image');
    this.pictureUrl = this.url + this.entityData.attributes.entity_picture + '&t=' + new Date().getTime();
  }

  hold(entity) {
    this.cameraModal(entity);
  }

  async cameraModal(entity) {
    const modal = await this.modalController.create({
      component: CameraModalPage,
      cssClass: 'custom-modal-css',
      componentProps: {
        'entity': entity,
        'entityData': this.entityData,
        'connection': this.connection
      }
    });
    await modal.present();
  }


}
