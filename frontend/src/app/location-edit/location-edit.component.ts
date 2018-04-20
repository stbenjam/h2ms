import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '../model/location';
import {FormControl, Validators} from '@angular/forms';
import {REQUIRED_NAME, REQUIRED_NAME_ERROR_MESSAGE} from '../forms-common/form-controls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {getLinks} from "../api-utils";

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
    id: number;
    config: Config;
    locations: Location[];
    childrenMap: Map<number, Location[]> = new Map();

    constructor(private route: ActivatedRoute,
                private configService: ConfigService,
                private http: HttpClient,
                private router: Router) {
        this.route.paramMap.subscribe(
            params => {
                this.id = +(params.get('id'));
            }
        );
        this.config = this.configService.getConfig();

        const locationResolver = this.route.snapshot.data.locationResolver;
        this.initialLocation = locationResolver._embedded.locations.find(location => location.id === this.id);
        this.crudOperation = this.initialLocation ? CrudOperation.Update : CrudOperation.Create;

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
        }

        this.loadTopLevelLocations();
        this.nameFormControl.setValue(this.initialLocation.name);
        this.typeFormControl.setValue(this.initialLocation.type);
    }

    private loadTopLevelLocations() {
        this.http.get(this.config.getBackendUrl() + '/locations/search/findTopLevel').subscribe(
            ls => {
                this.locations = this.getPayload(ls).locations;
            }
        );
    }

    private getChildren(locationId: number) {
        if (!this.childrenMap.has(locationId)) {
            this.http.get(this.config.getBackendUrl() + '/locations/' + locationId + '/children').do(ls => {
                this.childrenMap.set(locationId, this.getPayload(ls).locations);
            }).subscribe();
        }


        return this.childrenMap.get(locationId);
    }

    private getPayload(ls) {
        return ls._embedded;
    }

    typeErrorMessage() {
        return this.typeFormControl.hasError('required') ? 'You must enter a value' : '';
    }

    getParent(location: Location) {
        const internalLocation = this.locations.find(l => location.id === l.id);
        if (!internalLocation.parent) {
            this.http.get(getLinks(internalLocation).parent.href).do(res => {
                internalLocation.parent = res;
            }).subscribe();
            console.log(internalLocation.parent);
        }

        return internalLocation.parent;
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
            {
                'address': address,
                'country': country,
                'name': name,
                'type': type,
                'zip': zip
            }, {
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

    private update(address: string, country: string, name: string, type: string, zip: string) {
        this.http.put<any>(this.config.getBackendUrl() + '/locations/' + this.id,
            {
                'address': address,
                'country': country,
                'name': name,
                'type': type,
                'zip': zip
            }, {
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
