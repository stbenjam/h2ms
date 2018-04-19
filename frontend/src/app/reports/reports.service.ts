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

    charts = [{
        value: 'Number of observations',
        viewValue: 'Number of observations',
        id: '',
        groupingClusters: [{
            name: 'Time',
            disabled: false,
            groupings: [{value: 'year', viewValue: 'Year'},
                {value: 'quarter', viewValue: 'Quarter'},
                {value: 'month', viewValue: 'Month'},
                {value: 'week', viewValue: 'Week'}]
        },
            {
                name: 'Person',
                disabled: false,
                groupings: [{value: 'observer', viewValue: 'Observer'}]
            },
            {
                name: 'Location',
                disabled: true,
                groupings: [{value: 'hospital', viewValue: 'Hospital'}]
            }
        ]
    }];

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

    numObsByObserver = {
        'Handwasher, John <jhandwasher@h2ms.org>': 10,
        'Handwasher, John <theotherjhandwasher@h2ms.org>': 500,
        'Clean, Jane <jclean@h2ms.org>': 1000,
    };

    constructor(private http: HttpClient,
                private configService: ConfigService) {
        this.config = configService.getConfig();
    }

    fetchReport(chart, grouping) {
        if (this.config.servicesReturnFakeData) {
            return Observable.of(this.fetchFakeData(this.buildURL(chart, grouping))).delay(350);
        } else {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return this.http.get(this.buildURL(chart, grouping), httpOptions);
        }
    }

    getCharts() {
        // todo get all charts from backend
        this.config.configQuestions.map(q => {
            this.charts.push(
                {value: 'Average compliance',
                viewValue: 'Average compliance for ' + q.displayName,
                id: q.id,
                groupingClusters: [{name: 'Time',
                disabled: false,
                groupings: [{value: 'year', viewValue: 'Year'},
                    {value: 'quarter', viewValue: 'Quarter'},
                    {value: 'month', viewValue: 'Month'},
                    {value: 'week', viewValue: 'Week'}]},
                {name: 'Person',
                    disabled: true,
                    groupings: [{value: 'observer', viewValue: 'Observer'}]},
                {name: 'Location',
                    disabled: false,
                    groupings: [{value: 'hospital', viewValue: 'Hospital'}]}
            ]});
            }
        );
        return this.charts;
    }

    /**
        Dynamic (booleans):
            average compliance by time:
                /events/compliance/{question_id}/{timeframe}
            average compliance by employee type:
                /users/compliance/{question_id}
            average compliance by location:
                /compliance/{questionId}/location

        Static:
            number of observations by time:
                /events/count/{time}
                example: /events/count/quarter
            number of observations by observer:
                /events/count/observer
     */
    private buildURL(chart, grouping) {
        if (chart.value.match('Number of observations')) {
            if (grouping.value.match('year') || grouping.value.match('quarter')
                || grouping.value.match('month') || grouping.value.match('week')
                || grouping.value.match('observer')) {
                return this.config.getBackendUrl() + '/' + 'events/count/' + grouping.value;
            } else {
                console.log('no url known for selected chart: \'' + chart.value + '\' ' +
                    'and grouping: \'' + grouping.value + '\'');
            }
        } else if (chart.value.indexOf('Average compliance') !== -1) {
            if (grouping.value.match('user')) {
                return this.config.getBackendUrl() + '/' + 'users/compliance/' + chart.id;
            } else if (grouping.value.match('year') || grouping.value.match('quarter')
                || grouping.value.match('month') || grouping.value.match('week')) {
                return this.config.getBackendUrl() + '/' + 'events/compliance/' + chart.id + '/' + grouping.value;
            } else if (grouping.value.match('hospital')) {
                return this.config.getBackendUrl() + '/' + 'events/compliance/' + chart.id + '/location';
            } else {
                console.log('no url known for selected chart: \'' + chart.value + '\' ' +
                    'and grouping: \'' + grouping.value + '\'');
            }
        } else {
            console.log('no url known for selected chart: \'' + chart.value + '\' ' +
                'and grouping: \'' + grouping.value + '\'');
        }
    }

    private fetchFakeData(url: string) {
        if (url.indexOf('events/count/') !== -1) {
            if (url.indexOf('year') !== -1) {
                return this.numObsByYear;
            } else if (url.indexOf('quarter') !== -1) {
                return this.numObsByQuarters;
            } else if (url.indexOf('month') !== -1) {
                return this.numObsByMonth;
            } else if (url.indexOf('week') !== -1) {
                return this.numObsByWeek;
            } else if (url.indexOf('observer') !== -1) {
                return this.numObsByObserver;
            }
        } else {
            return JSON.parse('{}');
        }
    }
}
