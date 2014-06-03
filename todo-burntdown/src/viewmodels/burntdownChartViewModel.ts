/// <reference path="../../libs/typings/custom.d.ts"/>
import ko = require('ko');
import bc = require('core/burntdownCalculation');
import storage = require('core/storage');

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

    updateActual(actualBurntdown: bc.IBurntdownRecord[], velocity: number): void;
    render(idealBurntdown: bc.IBurntdownRecord[]): void;

    clear(): void;
};

export class BurntdownChartViewModel implements IBurntdownChartViewModelApi, storage.ISerializable {
    
    private show = ko.observable(false);

    private velocity = ko.observable(0);

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

    updateActual = (actualBurntdown: bc.IBurntdownRecord[], velocity: number) => {
        var currentData = this.burntdownData(),
            actualValues = actualBurntdown.map((record, index, arr) => record.effort);

        currentData.datasets[1].data = actualValues;

        this.burntdownData(currentData);
        this.velocity(velocity);
    }

    clear = () => {
        this.burntdownData(this.chartSettings);
    }

    key = "burntdownChart";

    serialize() {
        return {
            velocity: this.velocity(),
            show: this.show(),
            chart: {
                labels: this.burntdownData().labels,
                ideal: this.burntdownData().datasets[0].data,
                actual: this.burntdownData().datasets[1].data
            }
        };
    }

    deserialize(data: any) {
        var currentData = this.burntdownData();

        currentData.labels = data.chart.labels;
        currentData.datasets[0].data = data.chart.ideal;
        currentData.datasets[1].data = data.chart.actual;
        
        this.velocity(data.velocity);
        this.burntdownData(currentData);
        this.show(data.show);
    }
};