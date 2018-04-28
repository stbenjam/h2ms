import { Injectable } from '@angular/core';
import {RoleEntityService} from '../../';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RoleResolverService {

    constructor(private roleEntityService: RoleEntityService) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot): Observable<any> {
        // Get 50 roles
        // TODO: figure out how paging is going to work... and how many to get initially
        return this.roleEntityService.findAllRoleUsingGET(undefined, '50', undefined);
    }

}
