/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
import ko = require('ko');
import timer = require('core/timer');
import clock = require('core/clock');

export interface ISettingsViewModelApi {

    createNewTodoItemHandler: () => void;

    stateChanged: (isRunning: boolean) => void;
}

export class SettingsViewModel implements ISettingsViewModelApi{

    constructor(private timer: timer.ITimer, private clock: clock.IClock){}

    private timeRange = {
        from: ko.observable(),
        to: ko.observable()
    };

    private isRunning = ko.observable(false);

    private duration = ko.computed(() => {
        if (this.timeRange.from() === undefined || this.timeRange.to() === undefined)
            return 0;

        return this.clock.toDays(this.clock.differenceBetweenDates(this.timeRange.from().toString(), this.timeRange.to().toString()));
    });

    public createNewTodoItemHandler: () => void;
    public stateChanged: (isRunning: boolean) => void;

    private changeState = () => {

        if (this.isRunning())
            this.timer.stop();
        else
            this.timer.start(this.duration());

        this.isRunning(!this.isRunning());

        this.stateChanged(this.isRunning());
    }

    private addDay = () => this.clock.addDays(1);

};