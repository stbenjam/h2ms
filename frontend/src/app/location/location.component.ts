import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Location} from '../model/location';
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

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

    constructor(private actr: ActivatedRoute) {
        const locationResolver = this.actr.snapshot.data.locationResolver;
        this.locations = locationResolver._embedded.locations;
        this.dataSource = new MatTableDataSource(this.locations);
    }

    delete(location: Location) {
        alert('About to delete ' + location.name);
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
