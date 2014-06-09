/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
/// <reference path="../../libs/typings/knockout.validation/knockout.validation.d.ts"/>
import timer = require('core/timer');
import clock = require('core/clock');
import storage = require('core/storage');
import reset = require('core/reset');

export interface ISettingsViewModelApi extends storage.ISerializable, reset.IResetable {

    createNewTodoItemHandler: () => void;

    stateChanged: (isRunning: boolean) => void;

    stop: () => void;

    isTodoListValid: () => boolean;

    duration: KnockoutComputed<number>;

    bindResetHandler: (resetHandler: reset.IResetable) => void;
}

export class SettingsViewModel implements ISettingsViewModelApi{

    key = "settingsViewModel";

    private resetHandlers: reset.IResetable[] = [];

    private internalControl = false;

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
        this.timeRange.from.extend({ required: {
            onlyIf: () => this.internalControl === false
        } });
        this.timeRange.to.extend({ required: {
            onlyIf: () => this.internalControl === false
        } });
        this.duration.extend({
            validation: {
                validator: () => {
                    return Date.parse(this.timeRange.from()) < Date.parse(this.timeRange.to());
                },
                message: 'Data pocz\u0105tku musi by\u0107 wcze\u015Bniejsza ni\u017C data ko\u0144ca',
                onlyIf: () => this.duration() !== 0 && this.internalControl === false
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

    private validate(show = true) {
        var errors = ko.validation.group([this.timeRange, this.duration], { deep: true });

        errors.showAllMessages(show);

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
        this.internalControl = true;

        this.timeRange.from(data.timeRange.from);
        this.timeRange.to(data.timeRange.to);
        this.isRunning(data.isRunning);

        this.internalControl = false;
    }

    public reset = () => {

        this.internalControl = true;

        this.timeRange.from(undefined);
        this.timeRange.to(undefined);

        this.validate(false);

        if (this.isRunning() === true){
            this.timer.stop();

            this.isRunning(false);
            this.stateChanged(this.isRunning());
        }

        this.resetHandlers.forEach(handle => handle.reset());

        this.internalControl = false;
    }

    public bindResetHandler = (resetHandler: reset.IResetable) => {
        this.resetHandlers.push(resetHandler);
    }

};