import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {UserEmailService} from '../user/service/user-email.service';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {AuthService} from './auth.service';
import {UserByEmailResolverService} from '../user/service/user-by-email-resolver.service';
import {UserRoleResolverService} from '../user/service/user-role-resolver.service';
import {PromiseObservable} from "rxjs/observable/PromiseObservable";
import {Observable} from "rxjs/Observable";

@Injectable()
export class EventGuardService implements CanActivate {

    config: Config;
    hasObserverRole = false;

    constructor(private userEmailService: UserEmailService,
                private configService: ConfigService,
                private http: HttpClient,
                private authService: AuthService,
                private userByEmailResolverService: UserByEmailResolverService,
                private userRoleResolverService: UserRoleResolverService) {
        this.config = this.configService.getConfig();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.authService.isLoggedIn()) {
            return false;
        }
        if (!this.hasObserverRole) {
            return this.checkObserver(route, state).valueOf();
        } else {
            return true;
        }
    }

    checkObserver(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.userByEmailResolverService.resolve(route, state).subscribe(u => {
            const roleRef = u._embedded.users[0]._links.roles.href;
            this.userRoleResolverService.resolve(route, state, roleRef).subscribe( n => {
                // todo check that I am receiving roles from backend
                for (const r in n._embedded.roles) {
                    if (n._embedded.roles[r].name.match('ROLE_OBSERVER')) {
                        console.log('hello: ' + n._embedded.roles[r].name);
                        return true;
                    }
                }
            });
        });
        console.log('goodbye');
        return false;
    }
}
