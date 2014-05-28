/// <reference path="../typings/knockout/knockout.d.ts"/>

export interface ITodoItem {
    id: number;
    isDone: boolean;
    text: string;
    expectedWork: number;
    actualWork: number;
}

export class TodoViewModel {
    
    todoItems: KnockoutObservableArray<ITodoItem> = ko.observableArray([]);

    constructor() {
        
    }

    newTodoItem = () => {
        this.todoItems.push({
            id: this.todoItems().length,
            isDone: false,
            text: 'Treść zadania',
            expectedWork: 0,
            actualWork: 0
        });
    }

    removeTodoItem = (item) => {
        this.todoItems.remove(it => it.id === item.id);
        console.log(arguments);
    }

};