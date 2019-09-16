import { Injectable }     from '@angular/core';
import { CanActivate }    from '@angular/router';
import { Router } from '@angular/router';
import { SettingsService } from "../service/settings.service";

@Injectable()
export class RedirectGuard implements CanActivate {
    async canActivate() {
        //Your redirect logic/condition. I use this.

        let url = await this.settingsService.get('url');
        let token = await this.settingsService.get('token');

        if(!url || !token) {
            await this.router.navigate(['/tabs/settings/tab']);
        }

        await this.router.navigate(['/tabs/0']);

        return true;
    }
    //Constructor
    constructor(private router: Router, private settingsService: SettingsService) { }
}