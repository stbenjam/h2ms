import {Injectable} from '@angular/core';
import * as c3 from 'c3';
import {ChartAPI} from 'c3';

@Injectable()
export class ReportsChartService {


    chart: ChartAPI;

    /**
     * a function to make a determination about which type of chart to make and calls helper to convert
     * json to chart data
     */
    makeBarChart(id, chart: string, grouping: string, data: Object) {
        if (grouping.match('quarter')) {
            this.makeBarChartNumObsByQuarter(id, data);
        } else if (grouping.match('month')) {
            this.makeBarChartNumObsByMonth(id, data);
        } else if (grouping.match('week')) {
            this.makeBarChartNumObsByWeek(id, data);
        } else {
            this.makeBarChartWithoutSubgrouping(id, data);
        }
    }

    /**
     * converts json for number of observations by a single grouping (e.g. year, observer, etc. )
     */
    makeBarChartWithoutSubgrouping(id, data: Object) {
        const names: string[] = new Array();
        const values: [[string | number]] = [['Count']];
        let totalXAxisLabelLength = 1;

        for (const key of Object.keys(data)) {
            names.push(key);
            values[0].push(data[key]);
            totalXAxisLabelLength += key.length + 1;
        }
        let xAxisLabelRotation = 0;
        if (totalXAxisLabelLength > 50) {
            xAxisLabelRotation = -90;
        }
        this.groupedBarChart(id, values, names, false, xAxisLabelRotation);
    }

    /**
     * converts json for number of observations by quarter to chart data
     */
    makeBarChartNumObsByQuarter(id, data: Object) {
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
        this.groupedBarChart(id, groupedColumnsData, categories, true);
    }

    /**
     * converts json for number of observations by month to chart data
     */
    makeBarChartNumObsByMonth(id, data: Object) {
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
        this.groupedBarChart(id, groupedColumnsData, categories, true);
    }

    /**
     * converts json for number of observations by week to chart data
     */
    makeBarChartNumObsByWeek(id, data: Object) {
        const categories: string[] = new Array();
        const groupedColumnsData: [[string | number]] = [['1st']];
        const referenceWeeks: string[] = ['1st'];

        for (let i = 2; i <= 52; i++) {
            groupedColumnsData.push([this.getOrdinal(i)]);
            referenceWeeks.push(this.getOrdinal(i));
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
        this.groupedBarChart(id, groupedColumnsData, categories, true);
    }

    /**
     * a helper function to add bar chart data to this.chart
     */
    groupedBarChart(id, groupedColumnsData, categories, legendShow, rotateXLabelsDegrees = 0) {
        let height = 320;
        if (rotateXLabelsDegrees !== 0) {
            height = 640;
        }
        this.chart = c3.generate({
            bindto: '#' + id,
            size: {
                height: height
            },
            data: {
                columns: groupedColumnsData,
                type: 'bar'
            },
            axis: {
                x: {
                    categories: categories,
                    type: 'category',
                    tick: {
                        rotate: rotateXLabelsDegrees,
                        multiline: false
                    }
                }
            },
            legend: {
                show: legendShow
            }
        });
    }

    /**
     * a helper function to convert a number to its ordinal (1st, 2nd, etc.) string value
     */
    getOrdinal(n: number): string {
        // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
        const s = ['th', 'st', 'nd', 'rd'],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}
