import {Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '../model/location';
import {FormControl, Validators} from '@angular/forms';
import {REQUIRED_NAME, REQUIRED_NAME_ERROR_MESSAGE} from '../forms-common/form-controls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {getPayload, sortArray} from '../api-utils';
import 'rxjs/add/operator/toPromise';
import {SelectLocationComponent} from '../select-location/select-location.component';

/**
 * Which CRUD operation the component is being used for.
 */
enum CrudOperation {
    Update = 'Update',
    Create = 'Create'
}

@Component({
    selector: 'app-location-edit',
    templateUrl: './location-edit.component.html',
    styleUrls: ['./location-edit.component.css', '../card.css']
})
/**
 * A Component for Creating and Updating singular locations.
 */
export class LocationEditComponent {
    nameFormControl: FormControl = REQUIRED_NAME;
    nameErrorMessage = REQUIRED_NAME_ERROR_MESSAGE;
    typeFormControl = new FormControl('', [Validators.required]);
    crudOperation: CrudOperation;
    initialLocation: Location;
    childrenLocations: Location[];
    id: number;
    config: Config;
    @ViewChild('parentLocation') parentLocation: SelectLocationComponent;


    constructor(private route: ActivatedRoute,
                private configService: ConfigService,
                private http: HttpClient,
                private router: Router) {
        this.config = this.configService.getConfig();
        this.route.paramMap.subscribe(
            params => {
                this.id = +(params.get('id'));

                const locationResolver = this.route.snapshot.data.locationResolver;
                this.initialLocation = locationResolver._embedded.locations.find(location => location.id === this.id);
                this.crudOperation = this.initialLocation ? CrudOperation.Update : CrudOperation.Create;
                this.childrenLocations = [];

                if (this.crudOperation === CrudOperation.Create) {
                    this.initialLocation = {
                        address: '',
                        children: null,
                        country: '',
                        id: null,
                        name: '',
                        parent: null,
                        type: '',
                        zip: '',
                    };
                } else if (this.crudOperation === CrudOperation.Update) {
                    this.http.get(this.config.getBackendUrl() + '/locations/' + this.id + '/parent')
                        .subscribe((res: Response) => {
                            this.parentLocation.setSelectedLocation(res);
                        });

                    this.http.get(this.config.getBackendUrl() + '/locations/' + this.id + '/children')
                        .subscribe(res => {
                            this.childrenLocations = sortArray(getPayload(res).locations, 'name');
                        });
                }

                this.nameFormControl.setValue(this.initialLocation.name);
                this.typeFormControl.setValue(this.initialLocation.type);
            }
        );
    }


    typeErrorMessage() {
        return this.typeFormControl.hasError('required') ? 'You must enter a value' : '';
    }


    submit(name: string, address: string, zip: string, country: string, type: string) {
        if (this.nameFormControl.invalid) {
            alert('Name is required.');
            return;
        } else if (this.typeFormControl.invalid) {
            alert('Type is required.');
            return;
        }

        if (this.crudOperation === CrudOperation.Create) {
            this.create(address, country, name, type, zip);
        } else {
            this.update(address, country, name, type, zip);
        }
    }

    private create(address: string, country: string, name: string, type: string, zip: string) {
        this.http.post<any>(this.config.getBackendUrl() + '/locations',
            this.getLocationBody(address, country, name, type, zip), {
                headers: this.getJsonHeader()
            }
        ).subscribe(
            data => this.router.navigate(['locations']),
            error => {
                alert('Failed to create a location.');
                console.log(error);
            }
        );
    }

    private getLocationBody(address: string, country: string, name: string, type: string, zip: string) {
        return {
            'address': address,
            'country': country,
            'name': name,
            'type': type,
            'zip': zip,
            'parent': this.parentLocation.getSelectedLocationUrl()
        };
    }

    private update(address: string, country: string, name: string, type: string, zip: string) {
        this.http.patch<any>(this.config.getBackendUrl() + '/locations/' + this.id,
            this.getLocationBody(address, country, name, type, zip), {
                headers: this.getJsonHeader()
            }
        ).subscribe(
            data => this.router.navigate(['locations']),
            error => {
                alert('Failed to update a location.');
                console.log(error);
            }
        );
    }

    private getJsonHeader() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }
}
