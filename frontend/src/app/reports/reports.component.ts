import {Component, OnInit} from '@angular/core';
import {ReportsService} from './reports.service';
import {FormControl, Validators} from '@angular/forms';
import {Config} from '../config/config';
import {ConfigService} from '../config/config.service';
import {ReportsChartService} from './reports-chart.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.css', '../card.css']
})
export class ReportsComponent implements OnInit {

    // todo: styles below should be added to styleURLs above when patternfly style is ready
    // '../../../node_modules/patternfly/dist/css/patternfly.min.css',
    // '../../../node_modules/patternfly/dist/css/patternfly-additions.css'
    // todo: chart title


    config: Config;
    chartName = 'chart';
    plots;
    groupings;
    // make progressBarIsHidden false when retrieving data from backend
    progressBarIsHidden: boolean;
    emptyJSONReturned: boolean;

    /**
     * form controls allow required fields
     */
    plotFormControl = new FormControl('', [
        Validators.required,
    ]);

    groupingFormControl = new FormControl('', [
        Validators.required,
    ]);


    constructor(private reportsService: ReportsService,
                private configService: ConfigService,
                private reportsChartService: ReportsChartService) {
        this.config = configService.getConfig();
    }

    ngOnInit() {
        this.progressBarIsHidden = false;
        this.emptyJSONReturned = false;

        // todo get dynamic reports to populate drop down
        this.reportsChartService.getPlots().subscribe(p => {
            this.plots = p;
        });
        this.reportsChartService.getGroupings().subscribe(g => {
            this.groupings = g;
        });

        this.progressBarIsHidden = true;
    }

    /**
     * This function submits a url to the reports service to retrieve a report json
     */
    submit(selectedPlot: string, selectedGrouping: string) {
        // todo: make sure valid input selection
        if (selectedPlot && selectedGrouping) {
            this.progressBarIsHidden = false;
            this.reportsService.fetchReport(this.config.getBackendUrl() + '/'
                + selectedPlot + selectedGrouping)
                .subscribe(
                    response => {
                        if (JSON.stringify(response).indexOf('{}') !== -1) {
                            this.emptyJSONReturned = true;
                        } else {
                            this.emptyJSONReturned = false;
                            this.reportsChartService.makeBarPlot(this.chartName,
                                selectedPlot, selectedGrouping, response);
                        }
                    },
                    error => {
                        this.progressBarIsHidden = true;
                        if (error.status === 401) {
                            alert('authentication error: please login');
                        }
                    }
                );
        }
    }


}
