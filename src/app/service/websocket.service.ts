import { Injectable } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { Auth, ConnectionOptions, Connection, subscribeConfig, getAuth, createConnection, AuthData } from 'home-assistant-js-websocket';
import { createSocket } from '../customsocket';
import { LoadingController, ToastController } from '@ionic/angular';
import { SettingsService } from './settings.service';
import { Router } from '@angular/router';
import { timer, Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { reject } from 'q';

export function saveTokens(data: AuthData | null): void {
  const storage = window.localStorage;
  console.log('Save AuthData');
  console.log(data);
  storage.setItem('hassTokens', JSON.stringify(data));
  console.log('AuthData SAVED!');
}

export async function loadTokens(): Promise<AuthData | null | undefined> {
  const storage = window.localStorage;
  console.log('Get hassTokens!!');
  const hassTokens =  storage.getItem('hassTokens');
  return JSON.parse(hassTokens);
}

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

  // tslint:disable-next-line: max-line-length
  constructor(public loadingController: LoadingController, public settingsService: SettingsService, public router: Router, public toastService: ToastService, private http: HttpClient) {

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
      const expires = new Date().getTime() + 1e11;
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
        expires,
        hassUrl: this.url,
        clientId: null,
        refresh_token: null,
        expires_in: null
      });

      const socket = await connOptions.createSocket(connOptions);
      this.connection = await new Connection(socket, connOptions);
    } else {
      const auth = await getAuth({ hassUrl: this.url, saveTokens: saveTokens, loadTokens: loadTokens});
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
      console.log(auth);
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
            console.log('PONG!');
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

  apiCall(method: string, url: string) {
    let bearer = this.token;
    if (!this.longTokenEnabled) {
      const hassTokens = JSON.parse(localStorage.getItem('hassTokens'));
      console.log(hassTokens);
      if (!hassTokens || !hassTokens.access_token) {
        return Observable.throw(new Error());
      }
      bearer = hassTokens.access_token;
    }

    const httpOptions = {
        headers: new HttpHeaders({
          'Authorization': 'Bearer ' + bearer,
          'Content-Type': 'application/json'
        })
    };

    console.log(httpOptions);

    // if (method === 'GET') {
    //   return this.http.get(this.url + '/api/' + url, httpOptions);
    // }
    return this.http.get(this.url + '/api/' + url, httpOptions);

  }
}
