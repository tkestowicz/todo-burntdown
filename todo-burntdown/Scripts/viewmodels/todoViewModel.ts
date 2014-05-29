/// <reference path="../typings/knockout/knockout.d.ts"/>

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

var sumElements = (sum: number, element: number, index: number, array: number[]): number => {
    return sum + parseInt(element.toString());
};

export class TodoViewModel {

    todoItems: KnockoutObservableArray<ITodoItem> = ko.observableArray([]);

    calculateSum = <TElement>(items: TElement[], item: (item: TElement) => number) => {
        var result = items
            .map(item)
            .reduce(sumElements, 0);

        return isNaN(result) ? 0 : result;        
    };

    workSummary: IWorkSummary = {
        expected: ko.computed(() => this.calculateSum(this.todoItems(), (el) => el.expectedWork()), this),
        actual: ko.computed(() => this.calculateSum(this.todoItems(), (el) => el.actualWork()), this)
    };

    constructor() {

    }

    newTodoItem = () => {
        this.todoItems.push({
            id: this.todoItems().length,
            isDone: ko.observable(false),
            text: ko.observable(''),
            expectedWork: ko.observable(0),
            actualWork: ko.observable(0)
        });
    }

    removeTodoItem = (item) => {
        this.todoItems.remove(it => it.id === item.id);
    }

};