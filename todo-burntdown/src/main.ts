/// <reference path="../libs/typings/requirejs/require.d.ts"/>
require.config({
    baseUrl: 'libs/',

    paths: {
        //main libraries
        jquery: 'jquery-2.1.1.min',
        bootstrap: 'bootstrap.min',
        chart: 'chartjs',
        viewmodels: '../src/viewmodels',
        core: '../src/core',
    },
    deps: ['jquery', 'bootstrap'],
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
    }
});

require([
    'viewmodels/todoViewModel', 'viewmodels/settingsViewModel', 'viewmodels/summaryViewModel', 'viewmodels/burntdownChartViewModel', 'core/burntdownCalculation', 'core/timer', 'core/virtualClock', 'core/storage', 'jquery', 'chart'],
    (todo, settings, summary, burntdownChart, burntdown, timer, clock, storage, $, chart) => {

        var todoClock = new clock.VirtualClock(new Date(Date.now()), 10000),
            todoTimer = new timer.Timer(todoClock, 2000),
            todoSettings = new settings.SettingsViewModel(todoTimer, todoClock),
            todoList = new todo.TodoViewModel(),
            todoSummary = new summary.SummaryViewModel(),
            todoBurntdown = new burntdown.BurntdownCalculation(),
            todoBurntdownChart = new burntdownChart.BurntdownChartViewModel(),
            sessionStorage = new storage.SessionStorage();

        sessionStorage.listeners.push(todoClock);
        sessionStorage.listeners.push(todoSettings);
        sessionStorage.listeners.push(todoList);
        sessionStorage.listeners.push(todoBurntdown);
        sessionStorage.listeners.push(todoBurntdownChart);
        sessionStorage.listeners.push(todoTimer);

        todoTimer.intervalElapsed = todoList.burntdownProgressChanged;
        todoTimer.stopped = todoSettings.stop;
        todoSettings.createNewTodoItemHandler = todoList.newTodoItem;
        todoSettings.isTodoListValid = todoList.validate; // implement
        todoSettings.stateChanged = (isRunning: boolean) => {

            todoList.toogleAccessibility(isRunning);

            if (isRunning === true) {

                todoBurntdown.reset();
                todoBurntdownChart.clear();

                todoBurntdown.initialize({
                    estimatedEffort: todoList.workSummary.expected(),
                    sprintDurationInDays: todoSettings.duration()
                });

                todoBurntdownChart.render(todoBurntdown.idealBurntdownCalculation());

            }
        };
        todoList.valuesUpdated = todoSummary.updateSummary;
        todoList.reportBurntdownProgress = todoBurntdown.actualBurntdownUpdated;

        todoBurntdown.actualBurntdownRecalulated = todoBurntdownChart.updateActual;

        ko.applyBindings(todoSettings, $('#settings')[0]);
        ko.applyBindings(todoList, $('#todoList')[0]);
        ko.applyBindings(todoSummary, $('#summary')[0]);
        ko.applyBindings(todoBurntdownChart, $('#chart')[0]);

        sessionStorage.load();

        if(location.search.indexOf("debug") === -1)
            setInterval(() => sessionStorage.save(), 200);
    });