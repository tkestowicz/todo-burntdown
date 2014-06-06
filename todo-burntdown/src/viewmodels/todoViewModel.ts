/// <reference path="../../libs/typings/knockout/knockout.d.ts"/>
import utils = require('core/utils');
import burntdown = require('core/burntdownCalculation');
import storage = require('core/storage');

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

    reportBurntdownProgress: (report: burntdown.IBurntdownRecord) => void;

    validate: () => boolean;
}

export class TodoViewModel implements ITodoViewModelApi, storage.ISerializable {

    private todoItems: KnockoutObservableArray<ITodoItem> = ko.observableArray([]);

    public workSummary = {
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

    private applyValidation(item: ITodoItem) {

        item.text.extend({ required: true });
        item.expectedWork.extend({
            required: true,
            number: true,
            min: { params: 1, message: "Czasoch\u0142onno\u015B\u0107 musi by\u0107 wi\u0119ksza od 0." }
        });
        item.actualWork.extend({
            required: true,
            number: true,
            min: { params: 0, message: "Czasoch\u0142onno\u015B\u0107 nie mo\u017Ce by\u0107 ujemna." }
        });

        return item;
    }

    private newTodoItem = () => {

        var todoItem = {
            id: this.todoItems().length,
            isDone: ko.observable(false),
            text: ko.observable<string>(),
            expectedWork: ko.observable<number>(),
            actualWork: ko.observable<number>()
        };

        this.addTodoItemToList(todoItem);
    }

    private addTodoItemToList = (item: ITodoItem) => {

        if (this.validate() === false) return;

        item = this.applyValidation(item);

        item.isDone.subscribe((isChecked) => {
            if (isChecked)
                item.actualWork(item.expectedWork());
            else
                item.actualWork(0);
        });

        this.todoItems.push(item);
    } 

    private removeTodoItem = (item) => {
        this.todoItems.remove(it => it.id === item.id);
    }

    burntdownProgressChanged = (day: number) => {
        this.reportBurntdownProgress({
            day: day,
            effort: this.workSummary.actual()
        });
    };

    validate = () => {
        var errors = ko.validation.group(this.todoItems(), { deep: true });

        errors.showAllMessages();

        return errors().length === 0;
    }

    reportBurntdownProgress: (report: burntdown.IBurntdownRecord) => void;


    key = "todoListViewModel";

    serialize() {
        return {
            isEnabled: this.isEnabled(),
            todoItems: this.todoItems().map(item =>  {
                return {
                    id: item.id,
                    isDone: item.isDone(),
                    text: item.text(),
                    expectedWork: item.expectedWork(),
                    actualWork: item.actualWork()
                };
            })
        };
    }

    deserialize(data: any) {
        this.isEnabled(data.isEnabled);

        data.todoItems.forEach(item => {
            var todoItem = {
                id: this.todoItems().length,
                isDone: ko.observable(item.isDone),
                text: ko.observable(item.text),
                expectedWork: ko.observable(item.expectedWork),
                actualWork: ko.observable(item.actualWork)
            };

            this.addTodoItemToList(todoItem);
        });
    }

};