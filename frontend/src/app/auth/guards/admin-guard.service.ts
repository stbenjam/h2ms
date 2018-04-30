import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../auth.service';
import {UserRoleService} from '../../user/service/user-role.service';

@Injectable()
export class AdminGuardService implements CanActivate {

    constructor(private router: Router,
                private authService: AuthService,
                private userRoleService: UserRoleService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['login']);
            return false;
        }
        return this.userRoleService.hasRoles(['ROLE_ADMIN']).flatMap((b) => {
            if (!b) {
                this.router.navigate(['about']);
            }
            return Observable.of(b);
        });
    }
}
