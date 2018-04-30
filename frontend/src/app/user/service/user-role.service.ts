import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserByEmailResolverService} from './user-by-email-resolver.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserRoleService {

    constructor(private userByEmailResolverService: UserByEmailResolverService) { }

    /**
     * determine if the current user has any role in list
     */
    hasRoles(list: [string]): Observable<boolean> {
        return this.userByEmailResolverService.resolve().flatMap((v) => {
            const roles = v._embedded.users[0].authorities.map(r => r.authority);
            let result = false;
            list.forEach(r => {
                result = result || roles.includes(r);
            });
            return Observable.of(result);
        });
    }
}
