/// <reference path="../libs/typings/requirejs/require.d.ts"/>
require.config({
    baseUrl: 'libs/',

    paths: {
        //main libraries
        jquery: 'jquery-2.1.1.min',
        ko: 'knockout-3.1.0',
        bootstrap: 'bootstrap.min',
        viewmodels: '../src/viewmodels',
        core: '../src/core'
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

require(['viewmodels/todoViewModel', 'viewmodels/settingsViewModel', 'viewmodels/summaryViewModel', 'viewmodels/burntdownChartViewModel', 'core/timer', 'core/clock', 'ko', 'jquery'],
    (todo, settings, summary, burntdown, timer, clock, ko, $) => {

        var todoClock = new clock.Clock(),
            todoTimer = new timer.Timer(todoClock),
            todoSettings = new settings.SettingsViewModel(todoTimer, todoClock),
            todoList = new todo.TodoViewModel(),
            todoSummary = new summary.SummaryViewModel(),
            todoBurntdown = new burntdown.BurntdownChartViewModel();

        todoTimer.intervalElapsed = todoList.burntdownProgressChanged;
        todoSettings.createNewTodoItemHandler = todoList.newTodoItem;
        todoSettings.stateChanged = todoList.toogleAccessibility;
        todoList.valuesUpdated = todoSummary.updateSummary;
        todoList.reportBurntdownProgress = todoBurntdown.addToHistory;


        ko.applyBindings(todoSettings, $('#settings')[0]);
        ko.applyBindings(todoList, $('#todoList')[0]);
        ko.applyBindings(todoSummary, $('#summary')[0]);

    });