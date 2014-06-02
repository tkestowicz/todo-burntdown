/// <reference path="../libs/typings/requirejs/require.d.ts"/>
require.config({
    baseUrl: 'libs/',

    paths: {
        //main libraries
        jquery: 'jquery-2.1.1.min',
        ko: 'knockout-3.1.0',
        bootstrap: 'bootstrap.min',
        chart: 'chartjs',
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

require(['viewmodels/todoViewModel', 'viewmodels/settingsViewModel', 'viewmodels/summaryViewModel', 'viewmodels/burntdownChartViewModel', 'core/burntdownCalculation', 'core/timer', 'core/virtualClock', 'ko', 'jquery', 'chart'],
    (todo, settings, summary, burntdownChart, burntdown, timer, clock, ko, $, chart) => {

        var todoClock = new clock.VirtualClock(new Date(Date.now()), 10000),
            todoTimer = new timer.Timer(todoClock, 2000),
            todoSettings = new settings.SettingsViewModel(todoTimer, todoClock),
            todoList = new todo.TodoViewModel(),
            todoSummary = new summary.SummaryViewModel(),
            todoBurntdown = new burntdown.BurntdownCalculation(),
            todoBurntdownChart = new burntdownChart.BurntdownChartViewModel();

        todoTimer.intervalElapsed = todoList.burntdownProgressChanged;
        todoTimer.stopped = todoSettings.stop;
        todoSettings.createNewTodoItemHandler = todoList.newTodoItem;
        todoSettings.stateChanged = (isRunning: boolean) => {

            todoList.toogleAccessibility(isRunning);

            if (isRunning === true) {
                todoBurntdown.initialize({
                    estimatedEffort: todoList.workSummary.expected(),
                    sprintDurationInDays: todoSettings.duration()
                });

                todoBurntdownChart.render(todoBurntdown.idealBurntdownCalculation());

            } else if (isRunning === true) {
                todoBurntdown.reset();
                todoBurntdownChart.clear();
            }
        };
        todoList.valuesUpdated = todoSummary.updateSummary;
        todoList.reportBurntdownProgress = todoBurntdown.actualBurntdownUpdated;

        todoBurntdown.actualBurntdownRecalulated = (history) => {
            todoBurntdownChart.updateActual(history);
        };


        ko.applyBindings(todoSettings, $('#settings')[0]);
        ko.applyBindings(todoList, $('#todoList')[0]);
        ko.applyBindings(todoSummary, $('#summary')[0]);
        ko.applyBindings(todoBurntdownChart, $('#chart')[0]);

    });