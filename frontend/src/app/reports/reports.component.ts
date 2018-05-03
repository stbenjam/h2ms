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

    config: Config;
    // make progressBarIsHidden false when retrieving data from backend
    emptyJSONReturned: boolean;
    chartName = 'chart';
    chartTitle = 'Loading chart';
    charts: any;
    selectedChart;
    selectedGrouping;

    chartFormControl = new FormControl('', [
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
        this.emptyJSONReturned = false;
        this.initChart();
    }

    private initChart() {
        this.reportsService.getCharts().subscribe(c => {
            this.charts = c;
            if (this.charts[0] === 'undefined') {
                console.log('charts not yet retrieved');
                this.initChart();
            } else if (c.length < 1) {
                console.log('no charts founds');
                this.initChart();
            } else {
                this.selectedChart = this.charts[0];
                this.selectedGrouping = this.selectedChart.groupingClusters[0].groupings[0];
                this.updateChart();
            }
        });
    }

    /**
     * This function gets the report from the ReportService then produces a chart with the
     * ReportsChartService
     */
    updateChart() {
        if (this.selectedChart && this.selectedGrouping) {
            this.reportsService.fetchReport(this.selectedChart, this.selectedGrouping)
                .subscribe(
                    response => {
                        if (JSON.stringify(response).indexOf('{}') !== -1) {
                            this.emptyJSONReturned = true;
                        } else {
                            this.emptyJSONReturned = false;
                            this.reportsChartService.makeBarChart(this.chartName,
                                this.selectedChart.value, this.selectedGrouping.value, response);
                        }
                        this.chartTitle = this.selectedChart.viewValue + ' grouped by '
                            + this.selectedGrouping.value;
                    },
                    error => {
                        if (error.status === 401) {
                            alert('authentication error: please login');
                        }
                    }
                );
        }
    }

    resetGrouping() {
        this.groupingFormControl.reset();
    }
}
