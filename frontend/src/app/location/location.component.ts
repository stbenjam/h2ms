import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '../model/location';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {getLinks, getPayload, sortArray} from '../api-utils';
import {getId} from '../api-utils';
import {Config} from '../config/config';
import {ConfigService} from '../config/config.service';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.css', '../card.css']
})
/**
 * A component for showing all locations in the app. The table is based heavily on the Angular
 * Material Table examples here: https://material.angular.io/components/table/overview
 */
export class LocationComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    locations: Location[];
    displayedColumns = ['name', 'address', 'parent', 'buttons'];
    dataSource: MatTableDataSource<Location>;
    config: Config;
    locationToParentName: Observable<string>[];

    constructor(private actr: ActivatedRoute,
                private router: Router,
                private http: HttpClient,
                private configService: ConfigService) {
        this.config = this.configService.getConfig();
        this.locationToParentName = [];
    }

    ngOnInit() {
        const locationResolver = this.actr.snapshot.data.locationResolver;
        this.locations = sortArray(locationResolver._embedded.locations, 'name');
        this.dataSource = new MatTableDataSource(this.locations);

        for (const location of this.locations) {
            location.parentName = 'N/A';
            this.http.get(this.config.getBackendUrl() + '/locations/' + location.id + '/parent').subscribe((parent: Location) => {
                    location.parentName = parent.name;
                    location.parent = parent;
                }
            );
        }
    }

    edit(location: Location) {
        this.router.navigate(['/locations/' + getId(location) + '/edit']);
    }

    delete(location: Location) {
        this.http.get(this.config.getBackendUrl() + '/locations/' + location.id + '/children')
            .subscribe((res: Response) => {
                    const children = getPayload(res).locations;
                if (children.length) {
                    alert(location.name + ' has ' + children.length + ' locations inside of it. ' +
                        'They must be deleted first before ' + location.name + ' can be deleted.');
                    return;
                    }

                if (confirm('Are you sure you want to delete ' + location.name + '?')) {
                        this.http.delete(getLinks(location).self.href, undefined).subscribe();
                        this.removeLocationFromTable(location);
                    }
                }
            );


    }

    getParentDisplay(location: Location) {
        return this.http.get(this.config.getBackendUrl() + '/locations/' + location.id + '/parent');
    }

    private removeLocationFromTable(location: Location) {
        const index = this.locations.indexOf(location, 0);
        if (index > -1) {
            this.locations.splice(index, 1);
            this.dataSource.data = this.locations;
        }
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
}


