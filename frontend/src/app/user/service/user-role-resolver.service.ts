import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {RoleEntityService} from '../../index';

@Injectable()
export class UserRoleResolverService {

    constructor(private roleEntityService: RoleEntityService) { }

    resolve(route: ActivatedRouteSnapshot, rstate: RouterStateSnapshot, href: string): Observable<any> {
        return this.roleEntityService.findAllRoleUsingGET(href, '50', undefined);
    }
}
