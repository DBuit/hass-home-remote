import { Component } from '@angular/core';
import { EntityTabPage } from '../entityTab/entityTab.page';
import { SettingsService } from "../service/settings.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabs: any[];
  component = EntityTabPage;

  constructor(public settingsService: SettingsService) {

  }

  ngOnInit() {
    this.construct();
  }

  async construct() {
    this.tabs = await this.settingsService.get('configuration');
    console.log(this.tabs);
  }

}
