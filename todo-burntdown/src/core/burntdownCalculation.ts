import utils = require('src/core/utils');

export interface IBurntdownConfiguration {
    estimatedEffort: number;
    sprintDurationInDays: number;
};

export interface IBurntdownCalculation {
    initialize(config: IBurntdownConfiguration): void;
    idealBurntdownCalculation(): IBurntdownRecord[];
    actualBurntdownUpdated: (record: IBurntdownRecord) => void; 
    actualBurntdownRecalulated: (burntdownHistory: IBurntdownRecord[]) => void;
};

export interface IBurntdownRecord {
    day: number;
    effort: number;
};

export class BurntdownCalculation implements  IBurntdownCalculation {
  
    private config: IBurntdownConfiguration;

    private burntdownHistory : IBurntdownRecord[] = [];

    initialize(config: IBurntdownConfiguration) {
        this.config = config;
    }

    idealBurntdownCalculation(): IBurntdownRecord[] {

        var factors = this.calculateLinearFunctionFactors(),
            result = [];

        for (var i = 0; i <= this.config.sprintDurationInDays; i++) {
            result.push({
                day: i,
                effort: factors.a * i + factors.b
            });
        }

        return result;
    }  

    actualBurntdownUpdated(record: IBurntdownRecord) {

        var today = this.burntdownHistory[record.day];

        this.isInitialized();

        if (today === undefined || today == null)
            this.burntdownHistory.push({
                day: record.day,
                effort: this.config.estimatedEffort - record.effort
            });

        else
            this.burntdownHistory[record.day].effort = this.config.estimatedEffort - record.effort;

        this.actualBurntdownRecalulated(this.burntdownHistory);
    }

    actualBurntdownRecalulated: (burntdownHistory: IBurntdownRecord[]) => void;

    private calculateLinearFunctionFactors() {

        this.isInitialized();

        return {
            b: this.config.estimatedEffort,
            a: -(this.config.estimatedEffort / this.config.sprintDurationInDays)
        };
    }

    private isInitialized() {
        if (this.config === undefined || this.config === null)
            throw new Error('Burntdown calculation object is not initialized');
    }

};