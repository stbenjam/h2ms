import {Injectable} from '@angular/core';
import {UserByEmailResolverService} from './user-by-email-resolver.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class UserRoleService {

    constructor(private userByEmailResolverService: UserByEmailResolverService) { }

    /**
     * determine if the current user has any role in list
     */
    hasRoles(list: [string]): Observable<boolean> {
        return this.userByEmailResolverService.resolve().flatMap((response) => {

            console.log('response: ' + JSON.stringify(response));

            // const roles = response._embedded.users[0].authorities.map(role => role.authority);
            let result = false;
            // list.forEach(r => {
            //     result = result || roles.includes(r);
            // });
            return Observable.of(result);
        });
    }
}
