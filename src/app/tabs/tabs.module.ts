import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedirectGuard } from './redirect-guard.service';
import { TabsPageRoutingModule } from './tabs.router.module';
import { PipesModule } from '../pipe/pipes.module';

import { TabsPage } from './tabs.page';

// Tabs
import { SettingsTabPage } from '../settingsTab/settingsTab.page';
import { EntityTabPage } from '../entityTab/entityTab.page';

// Tile
import { TileComponent } from '../tile/tile.component';
import { BlindsTileComponent } from '../blinds-tile/blinds-tile.component';
import { CameraTileComponent } from '../camera-tile/camera-tile.component';


@NgModule({
  imports: [
    PipesModule,
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage, SettingsTabPage, EntityTabPage, TileComponent, BlindsTileComponent, CameraTileComponent],
  providers: [RedirectGuard]
})
export class TabsPageModule {}
