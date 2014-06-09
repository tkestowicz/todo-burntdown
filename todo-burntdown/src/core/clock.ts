import storage = require('core/storage');

export interface IClock extends storage.ISerializable{

    now: () => Date;

    differenceBetweenDates: (from: string, to: string) => number;

    toDays: (miliseconds: number) => number;
};

export class Clock implements IClock {

    static dayInMiliseconds = 1000 * 3600 * 24;

    now = () => new Date(Date.now());

    differenceBetweenDates = (from: string, to: string): number => {
        return (Date.parse(to) - Date.parse(from));
    };

    toDays = (miliseconds: number): number => Math.floor(miliseconds / Clock.dayInMiliseconds);

    key = "clock";

    serialize() { return {}; }
    deserialize(data){}
};   