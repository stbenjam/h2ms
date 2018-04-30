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

    private charts = [{
        value: 'Number of observations',
        viewValue: 'Number of observations',
        id: '',
        groupingClusters: [{
            name: 'Time',
            disabled: false,
            groupings: [{value: 'year', viewValue: 'Year', disabled: false},
                {value: 'quarter', viewValue: 'Quarter', disabled: false},
                {value: 'month', viewValue: 'Month', disabled: false},
                {value: 'week', viewValue: 'Week', disabled: false}]
        },
            {
                name: 'Person',
                disabled: false,
                groupings: [{value: 'observer', viewValue: 'Observer', disabled: false},
                    {value: 'employee type', viewValue: 'Employee type', disabled: true}]
            },
            {
                name: 'Location',
                disabled: true,
                groupings: [{value: 'location', viewValue: 'All', disabled: true}]
            }
        ]
    }];

    private numObsByYear = {
        '2017': 100,
        '2018': 600
    };

    private numObsByQuarters = {
        'Q1 (2017)': 100,
        'Q2 (2017)': 200,
        'Q3 (2017)': 300,
        'Q4 (2017)': 400,
        'Q1 (2018)': 500,
        'Q2 (2018)': 600
    };

    private numObsByMonth = {
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

    private numObsByWeek = {
        '1st (2017)': 100, '2nd (2017)': 200, '3rd (2017)': 300, '4th (2017)': 400, '5th (2017)': 400,
        '6th (2017)': 400, '7th (2017)': 400, '8th (2017)': 400, '9th (2017)': 400, '10th (2017)': 400,
        '11th (2017)': 400, '12th (2017)': 400, '13th (2017)': 400, '14th (2017)': 400, '15th (2017)': 400,
        '16th (2017)': 400, '17th (2017)': 400, '18th (2017)': 400, '19th (2017)': 400, '20th (2017)': 400,
        '21st (2017)': 400, '22nd (2017)': 400, '23rd (2017)': 400, '24th (2017)': 400, '25th (2017)': 400,
        '26th (2017)': 400, '27th (2017)': 400, '28th (2017)': 400, '29th (2017)': 400, '30th (2017)': 400,
        '31st (2017)': 400, '32nd (2017)': 400, '33rd (2017)': 400, '34th (2017)': 400, '35th (2017)': 400,
        '36th (2017)': 400, '37th (2017)': 400, '38th (2017)': 400, '39th (2017)': 400, '40th (2017)': 400,
        '41st (2017)': 400, '42nd (2017)': 400, '43rd (2017)': 400, '44th (2017)': 400, '45th (2017)': 400,
        '46th (2017)': 400, '47th (2017)': 400, '48th (2017)': 400, '49th (2017)': 400, '50th (2017)': 400,
        '51st (2018)': 500, '52nd (2018)': 600,
        '1st (2018)': 500, '2nd (2018)': 600
    };

    private numObsByObserver = {
        'jhandwasher@h2ms.org': 10,
        'theotherjhandwasher@h2ms.org': 500,
        'jclean@h2ms.org': 1000,
        'bhandwasher@h2ms.org': 10,
        'anotherjhandwasher@h2ms.org': 500,
        'jclean2@h2ms.org': 1000,
    };

    // numObsByObserverRevised = {
    //     'Handwasher, John <jhandwasher@h2ms.org>': 10,
    //     'Handwasher, John <theotherjhandwasher@h2ms.org>': 500,
    //     'Clean, Jane <jclean@h2ms.org>': 1000,
    //     'Handwasher, Bob <bhandwasher@h2ms.org>': 10,
    //     'Handwasher, Joe <anotherjhandwasher@h2ms.org>': 500,
    //     'Clean, Jim <jclean2@h2ms.org>': 1000,
    // };

    private avgCompByLoc = {
        'MA General Hospital': 0.92222222222,
        'BCH': 0.9411111234
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
                groupings: [{value: 'year', viewValue: 'Year', disabled: false},
                    {value: 'quarter', viewValue: 'Quarter', disabled: false},
                    {value: 'month', viewValue: 'Month', disabled: false},
                    {value: 'week', viewValue: 'Week', disabled: false}]},
                {name: 'Person',
                    disabled: false,
                    groupings: [{value: 'observer', viewValue: 'Observer', disabled: true},
                                {value: 'employee type', viewValue: 'Employee type', disabled: false}]},
                {name: 'Location',
                    disabled: false,
                    groupings: [{value: 'location', viewValue: 'All', disabled: false}]}
            ]});
            }
        );
        return Observable.of(this.charts);
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
    /**
     * Thanks Ben
     */
    private buildURL(chart, grouping) {
        let urlSuffix;
        if (chart.value.match('Number of observations')) {
            urlSuffix = this.buildNumberOfObservationsUrlSuffix(grouping);
        } else if (chart.value.match('Average compliance')) {
            urlSuffix = this.buildAverageComplianceUrlSuffix(chart, grouping);
        }

        if (!urlSuffix) {
            console.log('no url known for selected chart: \'' + chart.value + '\' ' +
                'and grouping: \'' + grouping.value + '\'');
        }
        return this.config.getBackendUrl() + urlSuffix;
    }

    private buildAverageComplianceUrlSuffix(chart, grouping) {
        if (grouping.value.match('employee type')) {
            return '/users/compliance/' + chart.id;
        } else if (grouping.value.match('year') || grouping.value.match('quarter')
            || grouping.value.match('month') || grouping.value.match('week')) {
            return '/events/compliance/' + chart.id + '/' + grouping.value;
        } else if (grouping.value.match('location')) {
            return '/events/compliance/' + chart.id + '/location';
        } else {
            return undefined;
        }
    }

    private buildNumberOfObservationsUrlSuffix(grouping) {
        if (grouping.value.match('year') || grouping.value.match('quarter')
            || grouping.value.match('month') || grouping.value.match('week')
            || grouping.value.match('observer')) {
            return '/events/count/' + grouping.value;
        } else {
            return undefined;
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
        } else if (url.indexOf('location') !== -1) {
            return this.avgCompByLoc;
        } else {
            return JSON.parse('{}');
        }
    }
}
