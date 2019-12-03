import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';
import { ToastController, LoadingController } from '@ionic/angular';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'settingsTab.page.html',
  styleUrls: ['settingsTab.page.scss']
})
export class SettingsTabPage implements OnInit {

  url: string;
  token: string;
  configuration: object;
  configurationString: string;
  configurationUrl: string;
  idleEnabled = true;
  idleTime = 20;
  longTokenEnabled = false;

  // tslint:disable-next-line: max-line-length
  constructor(public settingsService: SettingsService, public router: Router, public toastController: ToastController, private http: HttpClient, public loadingController: LoadingController) { }

  async ngOnInit() {
    this.url = await this.settingsService.get('url');
    this.token = await this.settingsService.get('token');
    this.longTokenEnabled = await this.settingsService.get('longTokenEnabled');
    this.configuration = await this.settingsService.get('configuration');
    this.configurationUrl = await this.settingsService.get('configurationUrl');
    this.idleEnabled = await this.settingsService.get('idleEnabled');
    this.idleTime = await this.settingsService.get('idleTime');
    this.configurationString = JSON.stringify(this.configuration, undefined, 4);
    if (!this.longTokenEnabled) {
      this.longTokenEnabled = false;
    }
    if (!this.idleEnabled) {
      this.idleEnabled = true;
    }
    if (!this.idleTime) {
      this.idleTime = 20;
    }
  }


  async saveSettings() {
      let loading = await this.loadingController.create({
        message: 'Saving settings...'
      });
      await loading.present();


      console.log(this.url);
      console.log(this.token);
      console.log(this.longTokenEnabled);
      console.log(this.configurationUrl);
      console.log(this.idleEnabled);
      console.log(this.idleTime);

      await this.settingsService.set('url', this.url);
      await this.settingsService.set('token', this.token);
      await this.settingsService.set('longTokenEnabled', this.longTokenEnabled);
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
    let downloadUrl = 'https://cors-anywhere.herokuapp.com/'+this.url+'/local/home_remote/configuration.json';
    if(!this.configurationUrl) {
      this.toast('Download configuration from default path /local/home_remote/configuration.json');
    } else {
      downloadUrl = this.configurationUrl;
    }
    // GET JSON from url
    let loading = await this.loadingController.create({
      message: 'Downloading configuration file...'
    });
    await loading.present();
    this.download(downloadUrl).subscribe((data: any) => {
      this.configuration = data;
      this.settingsService.set('configuration', this.configuration);
      this.configurationString = JSON.stringify(this.configuration, undefined, 4);
      loading.dismiss();
      this.toast('Configuration saved');

    }, (error) => {
      loading.dismiss();
      this.toast('Error retrieving configuration: '+error.message);
    });
  }

  download(url: string) {
    const headerDict = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    return this.http.get(url + '?t=' + new Date().getTime(), requestOptions);
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    await toast.present();
  }

  refresh() {
    window.location.reload();
  }

}
