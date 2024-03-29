﻿import utils = require('src/core/utils');
import storage = require('src/core/storage');
import reset = require('src/core/reset');

export interface IBurntdownConfiguration {
    estimatedEffort: number;
    sprintDurationInDays: number;
};

export interface IBurntdownCalculation extends storage.ISerializable, reset.IResetable {
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

export class BurntdownCalculation implements IBurntdownCalculation {
  
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

        var today = this.burntdownHistory[record.day],
            daysInHistory = this.burntdownHistory.length,
            lastRecord = this.burntdownHistory[daysInHistory - 1];

        this.isInitialized();

        if (today === undefined || today === null) {

            // fill the gap in history if user came back after few days
            for (var day = daysInHistory; day < record.day; day++) {
                this.burntdownHistory.push({
                    day: day,
                    effort: lastRecord.effort
                });
            }

            this.burntdownHistory.push({
                day: record.day,
                effort: (record.day === 0)
                    ? this.config.estimatedEffort
                    : (this.config.estimatedEffort - record.effort)
            });
        } else
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

        var velocity = (this.config.sprintDurationInDays < record.day)
            ? record.effort / this.config.sprintDurationInDays
            : record.effort / record.day;

        return parseFloat(new Number(velocity).toPrecision(2));
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