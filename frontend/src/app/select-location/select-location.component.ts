import {
    AfterContentInit, AfterViewInit, Component, OnInit, QueryList, ViewChild,
    ViewChildren
} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {getId, getLinks} from '../api-utils';
import {ParentLocationFinder} from '../location/get-parent-locations';
import {Location} from '../model/location';
import {MatSelect} from '@angular/material';

@Component({
    selector: 'app-select-location',
    templateUrl: './select-location.component.html',
    styleUrls: ['./select-location.component.css']
})
export class SelectLocationComponent implements OnInit {

    @ViewChild('topLevelLocation') topLevelLocation;
    @ViewChild('childLocation1') childLocation1;
    @ViewChild('childLocation2') childLocation2;
    config: Config;
    selectedLevelsToChildrenLocationsList: Observable<Location[]>[];
    selectedLocations: Location[];
    locations: Location[];

    constructor(private configService: ConfigService,
                private http: HttpClient,
                private parentLocationFinder: ParentLocationFinder) {
        this.config = configService.getConfig();

    }

    ngOnInit() {
        this.loadTopLevelLocations();
        this.selectedLevelsToChildrenLocationsList = [Observable.of([])];
        this.selectedLocations = [];

    }


    private updateSubLocationsFromId(locationId: number, level: number) {
        if (!locationId) {
            this.updateSubLocations(undefined, level);
            return;
        }

        this.http.get(this.config.getBackendUrl() + '/locations/' + locationId)
            .subscribe(data => {
                this.updateSubLocations(data, level);
            });
    }

    private updateSubLocations(location: Location, level: number) {
        this.wipeLevelsAtAndAfter(level);
        if (location == null) {
            console.log('Location is null.');
            this.selectedLevelsToChildrenLocationsList[level] = Observable.of([]);
            return;
        }

        this.selectedLocations[level] = location;
        this.setLocationDropDown(level);

        this.http.get(this.config.getBackendUrl() + '/locations/' + getId(location) + '/children')
            .subscribe((res: Response) => {
                const locs = this.sortByKey(this.getPayload(res).locations, 'name');
                this.selectedLevelsToChildrenLocationsList[level] = Observable.of(locs);
            });
    }

    private wipeLevelsAtAndAfter(level: number) {
        for (let i = level; i < this.selectedLevelsToChildrenLocationsList.length; i++) {
            this.selectedLevelsToChildrenLocationsList[i] = Observable.of([]);
            this.selectedLocations.splice(i);
        }
    }

    private loadTopLevelLocations() {
        this.locations = [];
        this.http.get(this.config.getBackendUrl() + '/locations/search/findTopLevel').subscribe(
            ls => {
                this.locations = this.sortByKey(this.getPayload(ls).locations, 'name');
            }
        );
    }

    private getPayload(ls) {
        return ls._embedded;
    }

    public getSelectedLocation(): Location {
        if (!this.selectedLocations.length) {
            console.log('No location selected. Returning undefined.');
            return undefined;
        }

        return this.selectedLocations[this.selectedLocations.length - 1];
    }

    public setSelectedLocation(location: Location, level = 0) {
        if (!location) {
            this.updateSubLocations(location, level);
            return Observable.of();
        }

        this.parentLocationFinder.getParentLocations(location).subscribe(
            (locations: Location[]) => {
                console.log('Locations');
                console.log(locations);

                for (let i = 0; i < locations.length; i++) {
                    this.updateSubLocations(locations[i], i);
                }
            }, error => {
                console.log('Error while getting parent locations');
                console.log(error);
            }
        );
    }

    private setLocationDropDown(level: number) {
        let locationDropdown;
        if (level === 0) {
            locationDropdown = this.topLevelLocation;
        } else if (level === 1) {
            locationDropdown = this.childLocation1;
        } else if (level === 2) {
            locationDropdown = this.childLocation2;
        }

        console.log({
            level: level,
            before: locationDropdown,
            after: this.selectedLocations[level].id
        });
        locationDropdown.value = this.selectedLocations[level].id;
    }

    /**
     * https://stackoverflow.com/a/8175221
     */
    private sortByKey(array, key) {
        return array.sort(function (a, b) {
            const x = a[key];
            const y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
}
