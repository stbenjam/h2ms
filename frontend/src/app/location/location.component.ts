import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '../model/location';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-location',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.css', '../card.css']
})
export class LocationComponent implements AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    locations: Location[];
    displayedColumns = ['name', 'address', 'parent', 'buttons'];
    dataSource: MatTableDataSource<Location>;

    constructor(private actr: ActivatedRoute, private http: HttpClient) {
        const locationResolver = this.actr.snapshot.data.locationResolver;
        this.locations = locationResolver._embedded.locations;
        this.dataSource = new MatTableDataSource(this.locations);
    }

    delete(location: Location) {
        alert('About to delete ' + location.name);
        // TODO: Maybe add a "Are you sure?" prompt
        // TODO: Move to service
        return this.http.delete(location._links.self.href, undefined).subscribe();
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
