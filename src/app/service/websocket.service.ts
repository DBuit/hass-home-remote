import { Injectable } from '@angular/core';
import { Auth, ConnectionOptions, Connection, subscribeConfig, getAuth, createConnection } from 'home-assistant-js-websocket';
import { createSocket } from '../customsocket';
import { LoadingController, ToastController } from '@ionic/angular';
import { SettingsService } from './settings.service';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  connection: any;
  reconnectLoading: any;
  url: string;
  token: string;
  intervalTime: any;
  pinged = false;
  longTokenEnabled = false;

  constructor(public loadingController: LoadingController, public settingsService: SettingsService, public router: Router, public toastService: ToastService) {

  }

  async getConnection() {
      this.url = await this.settingsService.get('url');
      this.longTokenEnabled = await this.settingsService.get('longTokenEnabled');
      this.token = await this.settingsService.get('token');
      if (!this.connection) {
        await this.connect();
      }
      return this.connection;
  }

  async connect() {
    this.toastService.sendToast('Ha connection', 'Please wait...', true, false, 0);

    
    if(this.longTokenEnabled) {
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
    } else {
      const auth = await getAuth({ hassUrl: this.url });
      const defaultConnectionOptions: ConnectionOptions = {
        setupRetry: 10,
        createSocket
      };
      const connOptions: ConnectionOptions = Object.assign(
          {},
          defaultConnectionOptions
      );
      connOptions.auth = auth;
      this.connection = await createConnection(connOptions);
    }
    this.connection.addEventListener('disconnected', this.reconnecting(this.connection, this));
    this.connection.addEventListener('ready', this.connectionReady(this.connection, this));

    this.pingTimer();
  }

  pingTimer() {
    this.intervalTime = timer(15000, 15000).subscribe((res) => {
      console.log('pingTimer');
      if(!this.pinged) {
        this.pinged = true;
        console.log('PING');
        this.connection.ping().then(() => {
            this.pinged = false;
            console.log('PONG!')
        });

        this.resetPingTimer();
      } else {
        console.log('NO PONG');
        this.intervalTime.unsubscribe();
        this.pinged = false;
        this.connect();
      }
    });

  }

  genClientId() {
    return `${location.protocol}//${location.host}/`;
  }

  resetPingTimer() {
    this.intervalTime.unsubscribe();
    this.pingTimer();
  }

  async reconnecting(connection, data) {
    console.log('Reconnecting');
    this.toastService.sendToast('Ha connection', 'Reconnecting...', true, false, 0);
  }

  async connectionReady(connection, data) {
    console.log('Connection has been established again');
    this.toastService.sendToast('Ha connection', 'Connection has been established again', false, true, 2000);
  }
}
