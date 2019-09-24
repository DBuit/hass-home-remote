import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';

// Modals
import { BrightnessModalPage } from './modal/brightness.modal.page';
import { BlindModalPage } from './modal/blind.modal.page';
import { SwitchModalPage } from './modal/switch.modal.page';
import { MediaModalPage } from './modal/media.modal.page';

//Screensaver
import { ScreensaverTimerDirective } from './screensaver-timer.directive';

@NgModule({
  declarations: [AppComponent, BrightnessModalPage, BlindModalPage, SwitchModalPage, ScreensaverTimerDirective, MediaModalPage],
  entryComponents: [BrightnessModalPage, BlindModalPage, SwitchModalPage, MediaModalPage],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule, IonicStorageModule.forRoot(), ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production})],
  providers: [
    StatusBar,
    SplashScreen,
    BrightnessModalPage,
    BlindModalPage,
    SwitchModalPage,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
