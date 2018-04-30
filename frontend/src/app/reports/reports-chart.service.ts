import {Injectable} from '@angular/core';
import * as c3 from 'c3';
import * as d3 from 'd3';

@Injectable()
export class ReportsChartService {

    /**
     * a helper function to convert a number to its ordinal (1st, 2nd, etc.) string value
     */
    private static getOrdinal(n: number): string {
        // https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
        const s = ['th', 'st', 'nd', 'rd'],
            v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    /**
     * a function to make a determination about which type of chart to make and calls helper to convert
     * json to chart data
     */
    makeBarChart(id, chart: string, grouping: string, data: Object) {
        if (grouping.match('quarter')) {
            this.makeBarChartNumObsByQuarter(id, chart, data);
        } else if (grouping.match('month')) {
            this.makeBarChartNumObsByMonth(id, chart, data);
        } else if (grouping.match('week')) {
            this.makeBarChartNumObsByWeek(id, chart, data);
        } else if (grouping.match('observer')
            || grouping.match('employee type')
            || grouping.match('location')) {
            this.makeBarChartNumObsByUser(id, chart, data);
        } else {
            this.makeBarChartWithoutSubgrouping(id, chart, data);
        }
    }

    /**
     * converts json for number of observations by quarter to chart data
     */
    private makeBarChartNumObsByUser(id, chart, data: Object) {
        const categories: string[] = ['Value'];
        const groupedColumnsData: [[string | number]] = [['']];
        let totalXAxisLabelLength = 1;

        for (const key of Object.keys(data)) {
            groupedColumnsData.push([key, data[key]]);
            totalXAxisLabelLength += key.length + 1;
        }

        let xAxisLabelRotation = 0;
        if (totalXAxisLabelLength > 50) {
            xAxisLabelRotation = -90;
        }

        this.groupedBarChart(id, groupedColumnsData, categories, true,
            chart, xAxisLabelRotation, false, true);
    }

    /**
     * converts json for number of observations by a single grouping (e.g. year, observer, etc. )
     */
    private makeBarChartWithoutSubgrouping(id, chart, data: Object) {
        const names: string[] = [];
        const values: [[string | number]] = [['Value']];
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
        this.groupedBarChart(id, values, names, false, chart, xAxisLabelRotation);
    }

    /**
     * converts json for number of observations by quarter to chart data
     */
    private makeBarChartNumObsByQuarter(id, chart, data: Object) {
        const categories: string[] = [];
        const groupedColumnsData: [[string | number]] = [['Q1'], ['Q2'], ['Q3'], ['Q4']];

        for (const key of Object.keys(data)) {
            const quarter = parseInt(key.substr(1, 1), 10);
            groupedColumnsData[quarter - 1].push(data[key]);

            const year = key.substr(4, 4);
            if (categories.indexOf(year) === -1) {
                categories.push(year);
            }
        }
        this.groupedBarChart(id, groupedColumnsData, categories, true, chart);
    }

    /**
     * converts json for number of observations by month to chart data
     */
    private makeBarChartNumObsByMonth(id, chart, data: Object) {
        const referenceMonths = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        const categories: string[] = [];
        const groupedColumnsData: [[string | number]] =
            [['January'], ['February'], ['March'], ['April'], ['May'], ['June'],
                ['July'], ['August'], ['September'], ['October'], ['November'], ['December']];

        for (const key of Object.keys(data)) {
            const endOfMonthName = key.indexOf(' (');
            const month = key.substr(0, endOfMonthName);
            groupedColumnsData[referenceMonths.indexOf(month)].push(data[key]);

            const year = key.substr(key.length - 5, 4);
            if (categories.indexOf(year) === -1) {
                categories.push(year);
            }
        }
        this.groupedBarChart(id, groupedColumnsData, categories, true, chart);
    }

    /**
     * converts json for number of observations by week to chart data
     */
    private makeBarChartNumObsByWeek(id, chart, data: Object) {
        const categories: string[] = [];
        const groupedColumnsData: [[string | number]] = [['1st']];
        const referenceWeeks: string[] = ['1st'];

        for (let i = 2; i <= 52; i++) {
            groupedColumnsData.push([ReportsChartService.getOrdinal(i)]);
            referenceWeeks.push(ReportsChartService.getOrdinal(i));
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
        this.groupedBarChart(id, groupedColumnsData, categories, true, chart);
    }

    /**
     * a helper function to add bar chart data to this.chart
     */
    private groupedBarChart(id, groupedColumnsData, categories, legendShow = true, yLabel = '',
                            rotateXLabelsDegrees = 0, xAxisShow = true, enableTooltip = true) {
        c3.generate({
            bindto: '#' + id,
            size: {
                height: 320
            },
            padding: {
                top: 20,
                bottom: 20,
                right: 100,
                left: 100
            },
            data: {
                columns: groupedColumnsData,
                type: 'bar'
            },
            axis: {
                x: {
                    show: xAxisShow,
                    categories: categories,
                    type: 'category',
                    tick: {
                        rotate: rotateXLabelsDegrees
                    }
                },
                y: {
                    label: {
                        text: yLabel,
                        position: 'outer-middle'
                    }
                }
            },
            legend: {
                show: legendShow
            },
            tooltip: {
                show: enableTooltip,
                grouped: false,
                format: {
                    title: function (x) {
                        return categories[x].toString().match('Value') ? '' : categories[x];
                    },
                    name: function (name) {
                        return name + ':';
                    },
                    value: function (value) {
                        return value.toString().indexOf('.') !== -1 ? d3.format('.2f')(value) : value;
                    }
                }
            }
        });
    }
}
