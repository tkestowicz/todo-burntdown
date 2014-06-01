import realClock = require('src/core/clock');

export class VirtualClock implements realClock.IClock {

    public daysOffset = 0;

    static dayInMiliseconds = 1000 * 3600 * 24;
    
    constructor(private startDay: Date, private dayDurationInMiliseconds: number) {
        setInterval(() => this.daysOffset++, this.dayDurationInMiliseconds);
    }
    
    now = () => new Date(this.startDay.getDate() + this.daysOffset * VirtualClock.dayInMiliseconds);

    differenceBetweenDates = (from: string, to: string): number => {
        return (Date.parse(to) - Date.parse(from));
    };

    toDays = (miliseconds: number): number => Math.floor(miliseconds / VirtualClock.dayInMiliseconds);

}