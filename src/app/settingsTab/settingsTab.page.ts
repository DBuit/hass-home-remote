import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from "../service/settings.service";
import { ToastController } from '@ionic/angular';
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

  constructor(public settingsService: SettingsService, public router: Router, public toastController: ToastController, private http: HttpClient) { }

  async ngOnInit() {
    this.url = await this.settingsService.get('url');
    this.token = await this.settingsService.get('token');
    this.configuration = await this.settingsService.get('configuration');
    this.configurationUrl = await this.settingsService.get('configurationUrl');
    this.configurationString = JSON.stringify(this.configuration, undefined, 4);

    console.log(this.url);
    console.log(this.token);
    console.log(this.configurationUrl);
  }


  async saveSettings() {

      console.log(this.url);
      console.log(this.token);
      console.log(this.configurationUrl);
      this.settingsService.set('url', this.url);
      this.settingsService.set('token', this.token);
      this.settingsService.set('configurationUrl', this.configurationUrl);

      const toast = await this.toastController.create({
        message: 'Your settings have been saved.',
        duration: 2000
      });
      toast.present();
  }

  async getConfiguration() {
    console.log('Get configuration');

    if(this.configurationUrl) {
      //GET JSON from url

      this.download(this.configurationUrl).subscribe((data: any) => {

        console.log(data);

        this.configuration = data;
        this.settingsService.set('configuration', this.configuration);
        this.configurationString = JSON.stringify(this.configuration, undefined, 4);

        this.toast('Configuration saved');
        // this.router.navigate(['/']);

      }, (error) => {
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
    toast.present();
  }

}
