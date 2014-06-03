/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
import ko = require('ko');
import timer = require('core/timer');
import clock = require('core/clock');
import storage = require('core/storage');

export interface ISettingsViewModelApi {

    createNewTodoItemHandler: () => void;

    stateChanged: (isRunning: boolean) => void;

    stop: () => void;
}

export class SettingsViewModel implements ISettingsViewModelApi, storage.ISerializable{

    key = "settingsViewModel";

    constructor(private timer: timer.ITimer, private clock: clock.IClock){}

    private timeRange = {
        from: ko.observable(),
        to: ko.observable()
    };

    private isRunning = ko.observable(false);

    public duration = ko.computed(() => {
        if (this.timeRange.from() === undefined || this.timeRange.to() === undefined)
            return 0;

        return this.clock.toDays(this.clock.differenceBetweenDates(this.timeRange.from().toString(), this.timeRange.to().toString()));
    });

    public stop = () => {
        this.isRunning(false);

        this.stateChanged(this.isRunning());
    }

    public createNewTodoItemHandler: () => void;
    public stateChanged: (isRunning: boolean) => void;

    private changeState = () => {

        if (this.isRunning() === true)
            this.timer.stop();
        else {
            this.timer.start(this.duration());

            this.isRunning(true);
            this.stateChanged(this.isRunning());
        }
    }

    public serialize() {
        return {
            timeRange: {
                from: this.timeRange.from(),
                to: this.timeRange.to()
            },
            isRunning: this.isRunning()
        };
    }

    public deserialize(data: any) {

        this.timeRange.from(data.timeRange.from);
        this.timeRange.to(data.timeRange.to);
        this.isRunning(data.isRunning);
    }

};