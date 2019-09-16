import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedirectGuard } from "./redirect-guard.service";
import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';

//Tabs
import { SettingsTabPage } from '../settingsTab/settingsTab.page';
import { EntityTabPage } from "../entityTab/entityTab.page";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage, SettingsTabPage, EntityTabPage],
  providers: [RedirectGuard]
})
export class TabsPageModule {}
