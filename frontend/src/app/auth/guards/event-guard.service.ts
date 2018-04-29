import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {resolve} from 'url';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EventGuardService implements CanActivate {

    hasObserverRole = false;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            alert('Please login to view this page.');
            this.router.navigate(['login']);
            return resolve(false);
        }
        if (!this.hasObserverRole) {
            alert('You do not have permissions to view this page.');
            this.router.navigate(['about']);
            return resolve(false);
        }
        return resolve(false);
    }
}
