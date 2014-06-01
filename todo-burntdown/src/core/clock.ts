export interface IClock {

    now: () => Date;

    differenceBetweenDates: (from: string, to: string) => number;

    toDays: (miliseconds: number) => number;

    addDays: (days: number) => void;
};

export class Clock implements IClock {

    offset = 0;

    static dayInMiliseconds = 1000 * 3600 * 24;

    now = () => new Date(Date.now() + this.offset);

    differenceBetweenDates = (from: string, to: string): number => {
        return (Date.parse(to) - Date.parse(from));
    };

    toDays = (miliseconds: number): number => Math.floor(miliseconds / Clock.dayInMiliseconds);

    addDays = (days: number) => {
        this.offset += days * Clock.dayInMiliseconds;
    }
};   