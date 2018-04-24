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
export class SelectLocationComponent implements OnInit, AfterViewInit {

    @ViewChildren(MatSelect) childLocations: QueryList<MatSelect>;
    @ViewChild('topLevelLocation') topLevelLocation;
    config: Config;
    locationChildrenLevels$: Observable<Location[]>[];
    selectedLocations: Location[];
    locations: Location[];

    constructor(private configService: ConfigService,
                private http: HttpClient,
                private parentLocationFinder: ParentLocationFinder) {
        this.config = configService.getConfig();

    }

    ngOnInit() {
        this.loadTopLevelLocations();
        this.locationChildrenLevels$ = [Observable.of([])];
        this.selectedLocations = [];

    }

    ngAfterViewInit() {
        this.childLocations.changes.subscribe(e => {
            setTimeout(() => {
                    let locations = e.toArray();
                    for (let i = 1; i < locations.length; i++) {
                        // TODO Bad, but meh
                        console.log("index: " + i);
                        console.log(locations[i].value);
                        console.log(this.selectedLocations[i]);


                        // locations[i].value = 1;
                    }
                },
                0);
        });
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
            this.locationChildrenLevels$[level] = Observable.of([]);
            return;
        }

        this.selectedLocations[level] = location;

        this.http.get(this.config.getBackendUrl() + '/locations/' + getId(location) + '/children')
            .subscribe((res: Response) => {
                const locs = this.sortByKey(this.getPayload(res).locations, 'name');
                this.locationChildrenLevels$[level] = Observable.of(locs);
            });
    }

    private wipeLevelsAtAndAfter(level: number) {
        for (let i = level; i < this.locationChildrenLevels$.length; i++) {
            this.locationChildrenLevels$[i] = Observable.of([]);
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

    public sleep(delay) {
        const start = new Date().getTime();
        while (new Date().getTime() < start + delay) {
        }
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

                this.topLevelLocation.value = locations[0].id;


                for (let i = 0; i < locations.length; i++) {
                    this.updateSubLocations(locations[i], i);
                    this.sleep(1000);
                }


            }, error => {
                console.log('Error while getting parent locations');
                console.log(error);
            }
        );
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
