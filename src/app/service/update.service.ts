import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private swUpdate: SwUpdate, public toastController: ToastController) {
    if (!this.swUpdate.isEnabled) {
      console.log('No service worker');
    } else {
      console.log('Service worker active');
      this.swUpdate.available.subscribe(evt => {
        this.showToast();
      });
    }
  }

  async showToast() {
    const toast = await this.toastController.create({
      header: 'App update',
      message: 'New version available',
      position: 'bottom',
      buttons: [
        {
          side: 'start',
          text: 'Refresh',
          handler: () => {
            window.location.reload();
          }
        }, {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    toast.present();
  }
}
