import {Injectable} from '@angular/core';
import * as c3 from 'c3';
import {ChartAPI} from 'c3';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ReportsChartService {

    chart: ChartAPI;
    plots = [{value: 'events/count/', viewValue: 'number of observations'}];
    groupings = [{value: 'year', viewValue: 'year'},
        {value: 'quarter', viewValue: 'quarter'},
        {value: 'month', viewValue: 'month'},
        {value: 'week', viewValue: 'week'}];

    constructor() {
    }

    /**
     * a function to make a determination about which type of plot to make and calls helper to convert
     * json to plot data
     */
    makeBarPlot(id, selectedPlot: string, selectedGrouping: string, data: Object) {
        if (selectedPlot.match('events/count/')) {
            if (selectedGrouping.match('year')) {
                this.makeBarPlotNumObsByYear(id, data);
            } else if (selectedGrouping.match('quarter')) {
                this.makeBarPlotNumObsByQuarter(id, data);
            } else if (selectedGrouping.match('month')) {
                this.makeBarPlotNumObsByMonth(id, data);
            } else if (selectedGrouping.match('week')) {
                this.makeBarPlotNumObsByWeek(id, data);
            }
        }
    }

    /**
     * converts json for number of observations by year to plot data
     */
    makeBarPlotNumObsByYear(id, data: Object) {
        const columns: string[] = new Array();
        const values: [[string | number]] = [['Value']];

        for (const key of Object.keys(data)) {
            columns.push(key);
            values[0].push(data[key]);
        }

        this.groupedBarPlot(id, values, columns, false);
    }

    /**
     * converts json for number of observations by quarter to plot data
     */
    makeBarPlotNumObsByQuarter(id, data: Object) {
        const categories: string[] = new Array();
        const groupedColumnsData: [[string | number]] = [['Q1'], ['Q2'], ['Q3'], ['Q4']];

        for (const key of Object.keys(data)) {
            const quarter = parseInt(key.substr(1, 1), 10);
            groupedColumnsData[quarter - 1].push(data[key]);

            const year = key.substr(4, 4);
            if (categories.indexOf(year) === -1) {
                categories.push(year);
            }
        }
        this.groupedBarPlot(id, groupedColumnsData, categories, true);
    }

    /**
     * converts json for number of observations by month to plot data
     */
    makeBarPlotNumObsByMonth(id, data: Object) {
        const referenceMonths = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const categories: string[] = new Array();
        const groupedColumnsData: [[string | number]] =
            [['January'], ['February'], ['March'], ['April'], ['May'], ['June'],
                ['July'], ['August'], ['September'], ['October'], ['November'], ['December']
            ];

        for (const key of Object.keys(data)) {
            const endOfMonthName = key.indexOf(' (');
            const month = key.substr(0, endOfMonthName);
            groupedColumnsData[referenceMonths.indexOf(month)].push(data[key]);

            const year = key.substr(key.length - 5, 4);
            if (categories.indexOf(year) === -1) {
                categories.push(year);
            }
        }
        this.groupedBarPlot(id, groupedColumnsData, categories, true);
    }

    /**
     * converts json for number of observations by week to plot data
     */
    makeBarPlotNumObsByWeek(id, data: Object) {
        const categories: string[] = new Array();
        const groupedColumnsData: [[string | number]] = [['1']];
        const referenceWeeks: string[] = ['1st'];

        for (let i = 2; i <= 52; i++) {
            groupedColumnsData.push(['' + i]);
            referenceWeeks.push(this.getGetOrdinal(i));
        }

        for (const key of Object.keys(data)) {
            const endOfWeekOrdName = key.indexOf(' (');
            const week = key.substr(0, endOfWeekOrdName);
            groupedColumnsData[referenceWeeks.indexOf(week)].push(data[key]);

            const year = key.substr(key.length - 5, 4);
            if (categories.indexOf(year) === -1) {
                categories.push(year);
            }
        }
        this.groupedBarPlot(id, groupedColumnsData, categories, true);
    }

    /**
     * a helper function to add bar plot data to this.chart
     */
    groupedBarPlot(id, groupedColumnsData, categories, legendShow) {
        // todo: fully implement pf style
        // const verticalBarChartConfig = patternfly.c3ChartDefaults().getDefaultGroupedBarConfig(categories);
        // verticalBarChartConfig.bindto = '#chart';
        // verticalBarChartConfig.data = {
        //             columns: groupedColumnsData,
        //             type: 'bar'};
        // verticalBarChartConfig.axis = {
        //             x: {categories: categories,
        //                 type: 'category'}};
        // verticalBarChartConfig.legend = {show: legendShow};
        // this.chart = c3.generate(verticalBarChartConfig);
        this.chart = c3.generate({
            bindto: '#' + id,
            data: {
                columns: groupedColumnsData,
                type: 'bar'
            },
            axis: {
                x: {
                    categories: categories,
                    type: 'category'
                }
            },
            legend: {
                show: legendShow
            }
        });
    }

    /**
     * a helder function to convert a number to its ordinal (1st, 2nd, etc.) string value
     */
    getGetOrdinal(n: number): string {
        // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
        const s = ['th', 'st', 'nd', 'rd'],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    getPlots() {
        // todo implement backend call for plots
        return Observable.of(this.plots);
    }

    getGroupings() {
        // todo implement backend call for plots
        return Observable.of(this.groupings);
    }
}
