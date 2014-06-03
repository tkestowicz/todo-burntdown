import clock = require('core/clock');
import storage = require('core/storage');

export interface ITimer {
    start: (durationInDays: number) => void;

    stop: () => void;

    elapsed: () => number;

    intervalElapsed: (days: number) => void;

    stopped: () => void;
};

export class  Timer implements ITimer, storage.ISerializable {
    
    private startedAt: Date;
    private durationInDays: number;
    private intervalHandle: number;

    constructor(private clock: clock.IClock, private interval: number) {
    }

    start = (durationInDays: number) => {
        this.startedAt = this.clock.now();
        this.durationInDays = durationInDays;

        this.resume();
    };

    stop = () => {

        clearInterval(this.intervalHandle);

        this.durationInDays = undefined;
        this.startedAt = undefined;
        this.intervalHandle = undefined;

        this.stopped();
    };

    elapsed = () => {
        return this.clock.toDays(this.clock.differenceBetweenDates(this.startedAt.toString(), this.clock.now().toString()));
    };

    private resume() {
        this.intervalHandle = setInterval(() => {

            this.intervalElapsed(this.elapsed());

            if (this.elapsed() > this.durationInDays)
                this.stop();

        }, this.interval);
    }

    intervalElapsed: (days) => void;

    stopped: () => void;

    key = "timer";

    serialize() {
        return {
            startedAt: (this.startedAt !== undefined) ? this.startedAt.valueOf() : undefined,
            duration: this.durationInDays
        };
    }

    deserialize(data: any) {
        if (data.startedAt !== undefined) {
            this.startedAt = new Date(data.startedAt);
            this.durationInDays = data.duration;

            this.intervalElapsed(this.elapsed());

            this.resume();   
        }
    }
};