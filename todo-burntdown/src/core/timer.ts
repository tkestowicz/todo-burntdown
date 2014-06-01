import clock = require('core/clock');

export interface ITimer {
    start: (durationInDays: number) => void;

    stop: () => void;

    elapsed: () => number;

    intervalElapsed: (days: number) => void;

    stopped: () => void;
};

export class  Timer implements ITimer {
    
    private startedAt: Date;
    private durationInDays: number;
    private intervalHandle: number;

    constructor(private clock: clock.IClock, private interval: number) {
    }

    start = (durationInDays: number) => {
        this.startedAt = this.clock.now();
        this.durationInDays = durationInDays;

        this.intervalHandle = setInterval(() => {

            this.intervalElapsed(this.elapsed());

            if (this.elapsed() >= this.durationInDays)
                this.stop();

        }, this.interval);
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

    intervalElapsed: (days) => void;

    stopped: () => void;
};