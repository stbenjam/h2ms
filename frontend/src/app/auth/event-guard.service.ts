import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {UserEmailService} from '../user/service/user-email.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {AuthService} from './auth.service';

@Injectable()
export class EventGuardService implements CanActivate {

    config: Config;
    hasObserverRole = false;

    constructor(private userEmailService: UserEmailService,
              private configService: ConfigService,
                private http: HttpClient,
                private authService: AuthService) {
      this.config = this.configService.getConfig();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isLoggedIn()) {
            return false;
        }
        if (!this.hasObserverRole) {
            this.fetchUser().subscribe( u => {
                const roles = u['roles'];
                roles.forEach(function (role) {
                    if (role.toLowerCase().match('observer')) {
                        this.hasObserverRole = true;
                        return false;
                    }
                });
                return false;
            });
        } else {
            return true;
        }
    }

    fetchUser() {
        const httpParams = new HttpParams();
        httpParams.append('param0', this.userEmailService.getEmail());
        const httpOptions = {
            params: httpParams,
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return this.http.get(this.config.getBackendUrl() + '/users/search/findOneByEmail', httpOptions);
    }

}
