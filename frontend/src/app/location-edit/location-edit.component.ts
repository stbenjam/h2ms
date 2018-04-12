import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '../model/location';

@Component({
    selector: 'app-location-edit',
    templateUrl: './location-edit.component.html',
    styleUrls: ['./location-edit.component.css']
})
export class LocationEditComponent implements OnInit {

    location: Location;
    id: number;

    constructor(private route: ActivatedRoute) {
        this.route.paramMap.subscribe(
            params => {
                this.id = +(params.get('id'));
            }
        );
        const locationResolver = this.route.snapshot.data.locationResolver;
        this.location = locationResolver._embedded.locations.find(location => location.id === this.id);
    }

    ngOnInit() {
    }

}
