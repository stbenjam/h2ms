import {Observable} from 'rxjs/Observable';
import {getId} from '../api-utils';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {Location} from '../model/location';
import {Injectable} from '@angular/core';

@Injectable()
/**
 * Helper class to find all of the parent locations of a given location.
 */
export class ParentLocationFinder {
    private config: Config;

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.config = configService.getConfig();
    }

    public getParentLocations(location: Location): Observable<Location[]> {
        if (!location) {
            return Observable.of([]);
        }

        return this.getLocations([], location, 0);
    }

    private getLocations(locations: Location[], location: Location, level = 0): Observable<Location[]> {
        // Builds the list backwards, then reverses at the end.

        return this.http.get(this.config.getBackendUrl() + '/locations/' + getId(location) + '/parent')
            .flatMap(
                (parent: Location) => {
                    locations[level] = location;
                    return this.getLocations(locations, parent, level + 1);
                }).catch(error => {
                // Not really an error, just doesn't have a parent
                locations[level] = location;
                locations.reverse();
                return Observable.of(locations);
            });
    }
}
