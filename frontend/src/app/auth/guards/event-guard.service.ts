import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from '../auth.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class EventGuardService implements CanActivate {

    hasObserverRole = true;

    constructor(private router: Router,
                private authService: AuthService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['login']);
            return false;
        }
        if (!this.hasObserverRole) {
            this.router.navigate(['about']);
            return false;
        }
        return true;
    }
}
