/// <reference path="../typings/knockout/knockout.d.ts"/>
import ko = require('ko');

export class SettingsViewModel {

    timeRange = {
        from: ko.observable(),
        to: ko.observable()
    };

    isRunning = ko.observable(false);

    duration = ko.computed(() => {
        if (this.timeRange.from() === undefined || this.timeRange.to() === undefined)
            return 0;

        return (Date.parse(this.timeRange.to().toString()) - Date.parse(this.timeRange.from().toString()))/3600/24/1000;
    });

    public createNewTodoItemHandler: () => void;
    public stateChanged: (isRunning: boolean) => void;

    changeState = () => {
        this.isRunning(!this.isRunning());

        this.stateChanged(this.isRunning());
    }

};