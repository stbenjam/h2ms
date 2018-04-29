import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../auth.service';

@Injectable()
export class AdminGuardService implements CanActivate {

    hasAdminRole = true;

    constructor(private router: Router,
                private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['login']);
            return false;
        }
        if (!this.hasAdminRole) {
            this.router.navigate(['about']);
            return false;
        }
        return true;
    }
}
