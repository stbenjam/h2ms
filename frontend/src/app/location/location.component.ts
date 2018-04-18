import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '../model/location';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {getLinks} from '../api-utils';
import {getId} from '../api-utils';

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
    displayedColumns = ['name', 'address', 'buttons'];
    dataSource: MatTableDataSource<Location>;

    constructor(private actr: ActivatedRoute,
                private router: Router,
                private http: HttpClient) {
    }

    ngOnInit() {
        const locationResolver = this.actr.snapshot.data.locationResolver;
        this.locations = locationResolver._embedded.locations;
        this.dataSource = new MatTableDataSource(this.locations);
    }

    edit(location: Location) {
        this.router.navigate(['/locations/' + getId(location) + '/edit']);
    }

    delete(location: Location) {
        if (confirm('Are you sure you want to delete ' + location.name)) {
            this.http.delete(getLinks(location).self.href, undefined).subscribe();
            this.removeLocationFromTable(location);
        }
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


