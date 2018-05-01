import {Injectable} from '@angular/core';
import {UsersByEmailResolverService} from './users-by-email-resolver.service';
import {Observable} from 'rxjs/Observable';
import {UserEmailService} from './user-email.service';

@Injectable()
export class UserRoleService {

    constructor(private usersByEmailResolverService: UsersByEmailResolverService,
                private userEmailService: UserEmailService) { }

    /**
     * determine if the current user has any role in list
     */
    hasRoles(list: [string]): Observable<boolean> {
        const email = this.userEmailService.getEmail();
        return this.usersByEmailResolverService.resolve().flatMap((response) => {
            const users = response._embedded.users;
            let hasARoleFromList = false;
            users.forEach(user => {
                if (email.match(user.email)) {
                    const roles = user.authorities.map(role => role.authority);
                    list.forEach(role => {
                        hasARoleFromList = hasARoleFromList || roles.includes(role);
                    });
                }
            });
            return Observable.of(hasARoleFromList);
        });
    }
}
