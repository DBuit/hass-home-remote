import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { SettingsTabPage } from "../settingsTab/settingsTab.page";
import { EntityTabPage} from "../entityTab/entityTab.page";
import { RedirectGuard } from "./redirect-guard.service";

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        children: [
          {
            path: ':index',
            component: EntityTabPage
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: 'tab',
            component: SettingsTabPage
          }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        canActivate: [RedirectGuard]
      }
    ]
  },
  {
    path: '',
    canActivate: [RedirectGuard],
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
