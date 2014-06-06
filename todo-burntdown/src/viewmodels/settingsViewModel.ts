/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
/// <reference path="../../libs/typings/knockout.validation/knockout.validation.d.ts"/>
import timer = require('core/timer');
import clock = require('core/clock');
import storage = require('core/storage');

export interface ISettingsViewModelApi {

    createNewTodoItemHandler: () => void;

    stateChanged: (isRunning: boolean) => void;

    stop: () => void;

    isTodoListValid: () => boolean;
}

export class SettingsViewModel implements ISettingsViewModelApi, storage.ISerializable{

    key = "settingsViewModel";

    constructor(private timer: timer.ITimer, private clock: clock.IClock) {
        this.applyValidation();
    }

    private timeRange = {
        from: ko.observable<string>(),
        to: ko.observable<string>()
    };

    private isRunning = ko.observable(false);

    public duration = ko.computed(() => {
        if (this.timeRange.from() === undefined || this.timeRange.from() === ""
            || this.timeRange.to() === undefined || this.timeRange.to() === "")
            return 0;

        return this.clock.toDays(this.clock.differenceBetweenDates(this.timeRange.from().toString(), this.timeRange.to().toString()));
    });
    
    applyValidation() {
        this.timeRange.from.extend({ required: true });
        this.timeRange.to.extend({ required: true });
        this.duration.extend({
            validation: {
                validator: () => {
                    return Date.parse(this.timeRange.from()) < Date.parse(this.timeRange.to());
                },
                message: 'Data pocz\u0105tku musi by\u0107 wcze\u015Bniejsza ni\u017C data ko\u0144ca',
                onlyIf: () => this.duration() !== 0
            }
        });
    }

    public stop = () => {
        this.isRunning(false);

        this.stateChanged(this.isRunning());
    }

    private addNewItemClicked = () => {
        if(this.validate() === true)
            this.createNewTodoItemHandler();
    }

    private validate() {
        var errors = ko.validation.group([this.timeRange, this.duration], { deep: true });

        errors.showAllMessages();

        return (errors().length === 0);
    }

    public createNewTodoItemHandler: () => void;
    public stateChanged: (isRunning: boolean) => void;
    public isTodoListValid: () => boolean;

    private changeState = () => {

        if (this.validate() === false || this.isTodoListValid() === false) return;

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