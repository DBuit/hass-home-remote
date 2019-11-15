import { Injectable } from '@angular/core';
import { Auth, ConnectionOptions, Connection, subscribeConfig } from "home-assistant-js-websocket";
import {createSocket} from "../customsocket";
import { LoadingController } from '@ionic/angular';
import { SettingsService } from "./settings.service";
import { Router } from '@angular/router';
import { timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  connection: any;
  reconnectLoading: any;
  url: string;
  token: string;
  intervalTime: any;
  pinged: false;


  constructor(public loadingController: LoadingController, public settingsService: SettingsService, public router: Router) {

  }

  async getConnection() {
      this.url = await this.settingsService.get('url');
      this.token = await this.settingsService.get('token');
      if (!this.connection) {
        await this.connect();
      }
      return this.connection;
  }

  async connect() {
    let loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    let expires = new Date().getTime() + 1e11;
    const defaultConnectionOptions: ConnectionOptions = {
      setupRetry: 10,
      createSocket
    };
    const connOptions: ConnectionOptions = Object.assign(
        {},
        defaultConnectionOptions
    );
    connOptions.auth = new Auth({
      access_token: this.token,
      expires: expires,
      hassUrl: this.url,
      clientId: null,
      refresh_token: null,
      expires_in: null
    });

    const socket = await connOptions.createSocket(connOptions);
    this.connection = await new Connection(socket, connOptions);
    loading.dismiss();

    this.connection.addEventListener("disconnected", this.reconnecting);
    this.connection.addEventListener("ready", this.eventHandler);

    this.pingTimer();
  }

  pingTimer() {
    this.intervalTime = timer(5000, 5000).subscribe((res) => {
      console.log('pingTimer');
      console.log('start ping');
      if(!this.pinged) {
        this.pinged = true;
        this.connection.ping().then(() => {
            this.pinged = false;
            console.log("PINGED!")
        });

        this.resetTimer
      } else {
        console.log('NO PONG');
        this.intervalTime.unsubscribe();
        this.connection.close();
        this.pinged = false;
        this.connect();
      }
    });

  }

  resetPingTimer() {
    this.intervalTime.unsubscribe();
    this.pingTimer();
  }

  async test(connection, data) {
    alert('CLOSED');
  }

  async reconnecting(connection, data) {
    console.log("Reconnecting");
    console.log(connection);
    console.log(data);
    console.log(this);

    let loading = await this.loadingController.create({
      message: 'Please wait...',
      id: 'reconnect'
    });
    console.log(loading);
    await loading.present();
  }

  async eventHandler(connection, data) {
    console.log(data);
    console.log("Connection has been established again");
    console.log(connection);
    await this.loadingController.dismiss({id: 'reconnect'})

  }
}
