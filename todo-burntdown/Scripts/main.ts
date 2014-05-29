/// <reference path="typings/requirejs/require.d.ts"/>
require.config({
    baseUrl: 'Scripts/libs/',

    paths: {
        //main libraries
        jquery: 'jquery-2.1.1.min',
        ko: 'knockout-3.1.0',
        bootstrap: 'bootstrap.min',
        viewmodels: '../viewmodels',
        utils: '../utils'
    },
    deps: ['jquery', 'bootstrap', 'ko'],
    shim: {
        jquery: {
            exports: '$'
        },
        bootstrap: {
            deps: ['jquery']
        }
    }
});

require(['viewmodels/todoViewModel', 'viewmodels/settingsViewModel', 'viewmodels/summaryViewModel', 'ko', 'jquery'], (todo, settings, summary, ko, $) => {
    
    var todoSettings = new settings.SettingsViewModel(),
        todoList = new todo.TodoViewModel(),
        todoSummary = new summary.SummaryViewModel();

    todoSettings.createNewTodoItemHandler = todoList.newTodoItem;
    todoSettings.stateChanged = todoList.toogleAccessibility;
    todoList.valuesUpdated = todoSummary.updateSummary;
    

    ko.applyBindings(todoSettings, $('#settings')[0]);
    ko.applyBindings(todoList, $('#todoList')[0]);
    ko.applyBindings(todoSummary, $('#summary')[0]);

});