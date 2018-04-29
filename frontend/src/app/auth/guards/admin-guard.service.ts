import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {resolve} from 'url';
import {AuthService} from '../auth.service';

@Injectable()
export class AdminGuardService implements CanActivate {

    hasAdminRole = false;

    constructor(private router: Router,
                private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            alert('Please login to view this page.');
            this.router.navigate(['login']);
            return resolve(false);
        }
        if (!this.hasAdminRole) {
            alert('You do not have permissions to view this page.');
            this.router.navigate(['about']);
            return resolve(false);
        }
        return resolve(false);
    }
}
