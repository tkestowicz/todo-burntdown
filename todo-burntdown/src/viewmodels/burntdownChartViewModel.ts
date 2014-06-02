/// <reference path="../../libs/typings/custom.d.ts"/>
import ko = require('ko');
import bc = require('core/burntdownCalculation');

ko.bindingHandlers.burntdownChart = {
    update: (element, valueAccessor) => {

        var data = valueAccessor()(),
            burntdownChart = new Chart(element.getContext("2d")).Line(data, {
                datasetFill: false,
                bezierCurve: false,
                scaleOverride: true,
                scaleSteps: data.labels.length * 4,
                scaleStepWidth: Math.ceil(data.datasets[0].data[0] / (data.labels.length * 4)),
                scaleStartValue: 0
        });
    }
};

export interface IBurntdownChartViewModelApi {

    updateActual(actualBurntdown: bc.IBurntdownRecord[]): void;
    render(idealBurntdown: bc.IBurntdownRecord[]): void;

    clear(): void;
};

export class BurntdownChartViewModel implements IBurntdownChartViewModelApi {
    
    private show = ko.observable(false);

    private chartSettings = {
        labels: [],
        datasets: [
            {
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                data: []
            },
            {
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                data: []
            }
        ]
    };

    private burntdownData = ko.observable(this.chartSettings);

    render = (idealBurntdown: bc.IBurntdownRecord[]) => {
        var labels = idealBurntdown.map((record, index, arr) => record.day),
            idealValues = idealBurntdown.map((record, index, arr) => record.effort),
            data = this.chartSettings;

        data.labels = labels;
        data.datasets[0].data = idealValues;

        this.burntdownData(data);

        this.show(true);
    }

    updateActual = (actualBurntdown: bc.IBurntdownRecord[]) => {
        var currentData = this.burntdownData(),
            actualValues = actualBurntdown.map((record, index, arr) => record.effort);

        currentData.datasets[1].data = actualValues;

        this.burntdownData(currentData);
    }

    clear = () => {
        this.show(false);

        this.burntdownData(this.chartSettings);
    }
};