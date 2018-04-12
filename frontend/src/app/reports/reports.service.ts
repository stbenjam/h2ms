import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConfigService} from '../config/config.service';
import {Config} from '../config/config';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';

@Injectable()
export class ReportsService {

    config: Config;

    numObsByYear = {
        '2017': 100,
        '2018': 600
    };

    numObsByQuarters = {
        'Q1 (2017)': 100,
        'Q2 (2017)': 200,
        'Q3 (2017)': 300,
        'Q4 (2017)': 400,
        'Q1 (2018)': 500,
        'Q2 (2018)': 600
    };

    numObsByMonth = {
        'January (2017)': 100,
        'February (2017)': 200,
        'March (2017)': 300,
        'April (2017)': 400,
        'May (2017)': 500,
        'June (2017)': 400,
        'July (2017)': 450,
        'August (2017)': 500,
        'September (2017)': 450,
        'October (2017)': 600,
        'November (2017)': 200,
        'December (2017)': 300,
        'January (2018)': 650
    };

    numObsByWeek = {
        '1st (2017)': 100,
        '2nd (2017)': 200,
        '3rd (2017)': 300,
        '4th (2017)': 400,
        '1st (2018)': 500,
        '2nd (2018)': 600
    };

    constructor(private http: HttpClient, private configService: ConfigService) {
        this.config = configService.getConfig();
    }

    fetchReport(url: string) {
        if (this.config.servicesReturnFakeData) {
            return Observable.of(this.fetchFakeData(url)).delay(350);
        } else {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return this.http.get(url, httpOptions);
        }
    }

    fetchFakeData(url: string) {
        if (url.indexOf('events/count/') !== -1) {
            if (url.indexOf('year') !== -1) {
                return this.numObsByYear;
            } else if (url.indexOf('quarter') !== -1) {
                return this.numObsByQuarters;
            } else if (url.indexOf('month') !== -1) {
                return this.numObsByMonth;
            } else if (url.indexOf('week') !== -1) {
                return this.numObsByWeek;
            }
        }
    }
}
