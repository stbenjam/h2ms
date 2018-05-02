import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {UserByEmailResolverService} from './user-by-email-resolver.service';

@Injectable()
export class UserRoleService {

    constructor(private userByEmailResolverService: UserByEmailResolverService) { }

    /**
     * determine if the current user has any role in list
     */
    hasRoles(rolesToCheck: [string]): Observable<boolean> {
        return this.userByEmailResolverService.resolve().flatMap((loggedInUser) => {
            console.log('loggedInUser: ' + loggedInUser);
            return Observable.of(false);
            // response._embedded.user.authorities;
        });
    }
}
