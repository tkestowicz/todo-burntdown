import utils = require('src/core/utils');
import storage = require('src/core/storage');

export interface IBurntdownConfiguration {
    estimatedEffort: number;
    sprintDurationInDays: number;
};

export interface IBurntdownCalculation {
    initialize(config: IBurntdownConfiguration): void;
    idealBurntdownCalculation(): IBurntdownRecord[];
    actualBurntdownUpdated: (record: IBurntdownRecord) => void; 
    actualBurntdownRecalulated: (burntdownHistory: IBurntdownRecord[], velocity: number) => void;
    reset: () => void;
};

export interface IBurntdownRecord {
    day: number;
    effort: number;
};

export class BurntdownCalculation implements IBurntdownCalculation, storage.ISerializable {
  
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

    actualBurntdownUpdated = (record: IBurntdownRecord) => {

        var today = this.burntdownHistory[record.day];

        this.isInitialized();

        if (today === undefined || today === null)
            this.burntdownHistory.push({
                day: record.day,
                effort: (record.day === 0)
                            ? this.config.estimatedEffort
                            : (this.config.estimatedEffort - record.effort)
            });

        else
            this.burntdownHistory[record.day].effort = this.config.estimatedEffort - record.effort;

        this.actualBurntdownRecalulated(this.burntdownHistory, this.calculateVelocity(record));
    }

    reset = () => {
        this.config = undefined;
        this.burntdownHistory = [];
    }

    actualBurntdownRecalulated: (burntdownHistory: IBurntdownRecord[], velocity: number) => void;

    private calculateLinearFunctionFactors() {

        this.isInitialized();

        return {
            b: this.config.estimatedEffort,
            a: -(this.config.estimatedEffort / this.config.sprintDurationInDays)
        };
    }

    private calculateVelocity(record: IBurntdownRecord) {
        if (record.day === 0) return 0;

        return (this.config.sprintDurationInDays < record.day)
            ? record.effort / this.config.sprintDurationInDays
            : record.effort / record.day;
    }

    private isInitialized() {
        if (this.config === undefined || this.config === null)
            throw new Error('Burntdown calculation object is not initialized');
    }

    key = "burntdownCalculation";

    serialize() {
        return {
            config: this.config,
            history: this.burntdownHistory
        };
    }

    deserialize(data: any) {
        this.config = data.config;
        this.burntdownHistory = data.history;
    }

};