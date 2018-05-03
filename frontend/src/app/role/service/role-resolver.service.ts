import { Injectable } from '@angular/core';
import {RoleEntityService} from '../../';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../auth/auth.service';

@Injectable()
export class RoleResolverService {

    constructor(private roleEntityService: RoleEntityService,
                private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        // Get 50 roles
        // TODO: figure out how paging is going to work... and how many to get initially
        if (!this.authService.isLoggedIn()) {
            return Observable.of([]);
        }
        return this.roleEntityService.findAllRoleUsingGET(undefined, '50', undefined);
    }

}
