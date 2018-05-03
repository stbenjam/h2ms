import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import '../rxjs-operators';

import { ResourceUser } from '../model/resourceUser';

import { BASE_PATH } from '../variables';
import { Configuration } from '../configuration';
import {Config} from '../config/config';
import {ConfigService} from '../config/config.service';
import {User} from '../model/user';


@Injectable()
export class UserRegistrationService {

    protected basePath = '';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    config: Config;

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration,
                @Optional() configService: ConfigService) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }

        if (configService) {
            this.config = configService.getConfig();
            this.basePath = this.config.getBackendUrl();
        }
    }

    public saveNewUserUsingPOST(body: User): Observable<ResourceUser> {
        if (body === null || body === undefined) {
            throw new Error('Required parameter body was null or undefined when calling saveUserUsingPOST.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        const httpHeaderAccepts: string[] = [
            '*/*'
        ];
        const httpHeaderAcceptSelected: string = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<any>(`${this.basePath}/registration/newuser/email`,
            body,
            {
                headers: headers,
                withCredentials: this.configuration.withCredentials,
            }
        );
    }

}
