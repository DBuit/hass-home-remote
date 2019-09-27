import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from "../service/settings.service";
import { ToastController, LoadingController } from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'settingsTab.page.html',
  styleUrls: ['settingsTab.page.scss']
})
export class SettingsTabPage {

  url: string;
  token: string;
  configuration: object;
  configurationString: string;
  configurationUrl: string;
  idleEnabled: boolean = true;
  idleTime: number = 20;

  constructor(public settingsService: SettingsService, public router: Router, public toastController: ToastController, private http: HttpClient, public loadingController: LoadingController) { }

  async ngOnInit() {
    this.url = await this.settingsService.get('url');
    this.token = await this.settingsService.get('token');
    this.configuration = await this.settingsService.get('configuration');
    this.configurationUrl = await this.settingsService.get('configurationUrl');
    this.idleEnabled = await this.settingsService.get('idleEnabled');
    this.idleTime = await this.settingsService.get('idleTime');
    this.configurationString = JSON.stringify(this.configuration, undefined, 4);
  }


  async saveSettings() {
      let loading = await this.loadingController.create({
        message: 'Saving settings...'
      });
      await loading.present();
      await this.settingsService.set('url', this.url);
      await this.settingsService.set('token', this.token);
      await this.settingsService.set('configurationUrl', this.configurationUrl);
      await this.settingsService.set('idleEnabled', this.idleEnabled);
    await this.settingsService.set('idleTime', this.idleTime);

      const toast = await this.toastController.create({
        message: 'Settings saved.',
        duration: 2000
      });
      await loading.dismiss();
      await toast.present();
  }

  async getConfiguration() {

    if(this.configurationUrl) {
      //GET JSON from url
      let loading = await this.loadingController.create({
        message: 'Downloading configuration file...'
      });
      await loading.present();
      this.download(this.configurationUrl).subscribe((data: any) => {
        this.configuration = data;
        this.settingsService.set('configuration', this.configuration);
        this.configurationString = JSON.stringify(this.configuration, undefined, 4);
        loading.dismiss();
        this.toast('Configuration saved');

      }, (error) => {
        loading.dismiss();
        this.toast('Error retrieving configuration: '+error.message);
      });
    } else {
      this.toast('No configuration url saved');
    }
  }

  download(url) {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(url+"?t="+new Date().getTime(), requestOptions);
  }

  async toast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  refresh() {
    window.location.reload();
  }

}
