import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {getId, getPayload, sortArray} from '../api-utils';
import {ParentLocationFinder} from '../location/get-parent-locations';
import {Location} from '../model/location';

@Component({
    selector: 'app-select-location',
    templateUrl: './select-location.component.html',
    styleUrls: ['./select-location.component.css']
})
/**
 * A component which allows you to get and set locations. Treat this as a black box.
 * Don't edit it unless you have to.
 */
export class SelectLocationComponent implements OnInit {

    @ViewChild('topLevelLocation') topLevelLocation;
    // TODO: Make more dynamic someday. :P
    @ViewChild('childLocation1') childLocation1;
    @ViewChild('childLocation2') childLocation2;
    @ViewChild('childLocation3') childLocation3;
    @ViewChild('childLocation4') childLocation4;
    @ViewChild('childLocation5') childLocation5;
    config: Config;
    selectedLevelsToChildLocations: Observable<Location[]>[];
    selectedLocations: Location[];
    topLevelLocations: Location[];

    constructor(private configService: ConfigService,
                private http: HttpClient,
                private parentLocationFinder: ParentLocationFinder) {
        this.config = configService.getConfig();

    }

    ngOnInit() {
        this.loadTopLevelLocations();
        this.selectedLevelsToChildLocations = [Observable.of([])];
        this.selectedLocations = [];
    }

    public getSelectedLocation(): Location {
        if (!this.selectedLocations.length) {
            console.log('No location selected. Returning undefined.');
            return undefined;
        }

        return this.selectedLocations[this.selectedLocations.length - 1];
    }

    public getSelectedLocationUrl(): string {
        const selectedLocation = this.getSelectedLocation();
        return selectedLocation ? this.config.getBackendUrl() + '/locations/' + selectedLocation.id : undefined;
    }

    public setSelectedLocation(location: Location, level = 0) {
        if (!location) {
            this.updateChildLocations(location, level);
            return Observable.of();
        }

        this.parentLocationFinder.getParentLocations(location).subscribe(
            (locations: Location[]) => {
                for (let i = 0; i < locations.length; i++) {
                    this.updateChildLocations(locations[i], i);
                }
            }, error => {
                console.log('Error while getting parent locations');
                console.log(error);
            }
        );
    }

    updateChildLocationsFromId(locationId: number, level: number) {
        if (!locationId) {
            this.updateChildLocations(undefined, level);
            return;
        }

        this.http.get(this.config.getBackendUrl() + '/locations/' + locationId)
            .subscribe(data => {
                this.updateChildLocations(data, level);
            });
    }

    updateChildLocations(location: Location, level: number) {
        this.resetLevelsAtAndAfter(level);
        if (location == null) {
            console.log('Location is null.');
            this.selectedLevelsToChildLocations[level] = Observable.of([]);
            return;
        }

        this.selectedLocations[level] = location;
        this.setLocationDropDown(level);

        this.http.get(this.config.getBackendUrl() + '/locations/' + getId(location) + '/children')
            .subscribe((res: Response) => {
                const locs = sortArray(getPayload(res).locations, 'name');
                this.selectedLevelsToChildLocations[level] = Observable.of(locs);
            });
    }

    private resetLevelsAtAndAfter(level: number) {
        for (let i = level; i < this.selectedLevelsToChildLocations.length; i++) {
            this.selectedLevelsToChildLocations[i] = Observable.of([]);
            this.selectedLocations.splice(i);
        }
    }

    private loadTopLevelLocations() {
        this.topLevelLocations = [];
        this.http.get(this.config.getBackendUrl() + '/locations/search/findTopLevel').subscribe(
            ls => {
                this.topLevelLocations = sortArray(getPayload(ls).locations, 'name');
            }
        );
    }


    /**
     * TODO: Make more dynamic someday. :P
     *
     * I have spent a good 10+ hours tying to make this dynamic always hitting subtle errors, not worth
     * the effort currently.
     */
    private setLocationDropDown(level: number) {
        let locationDropdown;
        if (level === 0) {
            locationDropdown = this.topLevelLocation;
        } else if (level === 1) {
            locationDropdown = this.childLocation1;
        } else if (level === 2) {
            locationDropdown = this.childLocation2;
        } else if (level === 3) {
            locationDropdown = this.childLocation3;
        } else if (level === 4) {
            locationDropdown = this.childLocation4;
        } else if (level === 5) {
            locationDropdown = this.childLocation5;
        }

        locationDropdown.value = this.selectedLocations[level].id;
    }
}
