import realClock = require('src/core/clock');
import storage = require('src/core/storage');

export class VirtualClock implements realClock.IClock, storage.ISerializable {

    public daysOffset = 0;

    private clockId = undefined;

    static dayInMiliseconds = 1000 * 3600 * 24;
    
    constructor(private startDay: Date, private dayDurationInMiliseconds: number) {
        this.start();
    }

    private start() {

        this.clockId = setInterval(() => this.daysOffset++, this.dayDurationInMiliseconds);
    }
    
    now = () => new Date(this.startDay.valueOf() + this.daysOffset * VirtualClock.dayInMiliseconds);

    differenceBetweenDates = (from: string, to: string): number => {
        return (Date.parse(to) - Date.parse(from));
    };

    toDays = (miliseconds: number): number => Math.floor(miliseconds / VirtualClock.dayInMiliseconds);

    key = "virtualClock";

    serialize() {
        return {
            offset: this.daysOffset,
            interval: this.dayDurationInMiliseconds,
            start: this.startDay.valueOf()
        };
    }

    deserialize(data: any) {
        this.daysOffset = data.offset;
        this.dayDurationInMiliseconds = data.interval;
        this.startDay = new Date(data.start);

        clearInterval(this.clockId);

        this.start();
    }
}