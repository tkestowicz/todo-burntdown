export interface IBurntdownHistory {
    day: number;
    burnt: number;  
};

export interface IBurntdownChartViewModelApi {
    addToHistory: (record: IBurntdownHistory) => void;
};

export class BurntdownChartViewModel implements IBurntdownChartViewModelApi {
    
    private history = [];

    addToHistory = (record: IBurntdownHistory) => {

        var today: IBurntdownHistory = this.history[record.day],
            overallBurntdown = (currentDay: number) => {

                var theDayBeforeToday: IBurntdownHistory = this.history.reverse().slice(1, 2)[0];

                return today.burnt + theDayBeforeToday.burnt;
            };
            

        if (today === undefined || today === null)
            this.history.push(record);

        else {
            this.history[record.day].burnt += record.burnt - overallBurntdown(record.day);
        }
            

        console.log(this.history);
    };
};