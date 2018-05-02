import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserByEmailResolverService} from './user-by-email-resolver.service';

@Injectable()
export class UserRoleCheckService {

    constructor(private userByEmailResolverService: UserByEmailResolverService) { }

    /**
     * determine if the current user has any role in list
     */
    hasRoles(list: [string]): Observable<boolean> {
        return this.userByEmailResolverService.resolve().flatMap((user) => {
            let hasAnAuthFromList = false;
            user.authorities.map((auth) => {
                 hasAnAuthFromList = hasAnAuthFromList || list.includes(auth.authority);
            });
            return Observable.of(hasAnAuthFromList);
        });
    }

    getRoles() {
        return this.userByEmailResolverService.resolve().flatMap((user) => {
            const authorities = user.authorities.map((auth) => {
                return auth.authority;
            });
            return Observable.of(authorities);
        });
    }
}
