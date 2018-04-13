import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from '../model/location';
import {FormControl} from "@angular/forms";
import {REQUIRED_NAME, REQUIRED_NAME_ERROR_MESSAGE} from '../forms-common/form-controls';

@Component({
    selector: 'app-location-edit',
    templateUrl: './location-edit.component.html',
    styleUrls: ['./location-edit.component.css', '../card.css']
})
export class LocationEditComponent implements OnInit {

    nameFormControl: FormControl = REQUIRED_NAME;
    nameErrorMessage = REQUIRED_NAME_ERROR_MESSAGE;
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
