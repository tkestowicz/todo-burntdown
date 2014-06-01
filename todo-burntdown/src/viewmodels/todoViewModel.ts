/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
import ko = require('ko');
import utils = require('core/utils');
import burntdown = require('viewmodels/burntdownChartViewModel');

export interface ITodoItem {
    id: number;
    isDone: KnockoutObservable<boolean>;
    text: KnockoutObservable<string>;
    expectedWork: KnockoutObservable<number>;
    actualWork: KnockoutObservable<number>;
}

export interface IWorkSummary {
    expected: KnockoutComputed<number>;
    actual: KnockoutComputed<number>;
}

export interface ITodoViewModelApi {

    toogleAccessibility: (enabled: boolean) => void;

    valuesUpdated: (workSummary: IWorkSummary) => void;

    burntdownProgressChanged: (day: number) => void;

    reportBurntdownProgress: (report: burntdown.IBurntdownHistory) => void;
}

export class TodoViewModel implements ITodoViewModelApi {

    private todoItems: KnockoutObservableArray<ITodoItem> = ko.observableArray([]);

    private workSummary = {
        expected: ko.computed(() => utils.calculateSumFromProperty(this.todoItems(), (el) => el.expectedWork()), this),
        actual: ko.computed(() => utils.calculateSumFromProperty(this.todoItems(), (el) => el.actualWork()), this)
    };

    private isEnabled = ko.observable(true);

    constructor() {
        this.workSummary.expected.subscribe(() => this.valuesUpdated(this.workSummary));
        this.workSummary.actual.subscribe(() => this.valuesUpdated(this.workSummary));
    }

    valuesUpdated: (workSummary: IWorkSummary) => void;

    toogleAccessibility = (enabled: boolean) => {
        this.isEnabled(!enabled);
    }

    private newTodoItem = () => {

        var todoItem = {
            id: this.todoItems().length,
            isDone: ko.observable(false),
            text: ko.observable(''),
            expectedWork: ko.observable(0),
            actualWork: ko.observable(0)
        };

        todoItem.isDone.subscribe(function (isChecked) {
            if (isChecked)
                todoItem.actualWork(todoItem.expectedWork());
            else
                todoItem.actualWork(0);
        });

        this.todoItems.push(todoItem);
    }

    private removeTodoItem = (item) => {
        this.todoItems.remove(it => it.id === item.id);
    }

    burntdownProgressChanged = (day: number) => {
        this.reportBurntdownProgress({
            day: day,
            burnt: this.workSummary.actual()
        });
    };

    reportBurntdownProgress: (report: burntdown.IBurntdownHistory) => void;

};