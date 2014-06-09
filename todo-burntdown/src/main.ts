/// <reference path="../libs/typings/requirejs/require.d.ts"/>
/// <reference path="../libs/typings/gapi/gapi.d.ts"/>
require.config({
    baseUrl: 'libs/',

    paths: {
        //main libraries
        jquery: 'jquery-2.1.1.min',
        bootstrap: 'bootstrap.min',
        chart: 'chartjs',
        viewmodels: '../src/viewmodels',
        core: '../src/core',
        app: '../src/app',
        services: '../src/services'
    },
    deps: ['jquery', 'bootstrap'],
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
    }
});

require([
    'app', 'viewmodels/todoViewModel', 'viewmodels/settingsViewModel', 'viewmodels/summaryViewModel',
    'viewmodels/burntdownChartViewModel', 'core/burntdownCalculation', 'core/timer', 'core/virtualClock',
    'core/storage', 'jquery', 'chart'],
    (app, todo, settings, summary, burntdownChart, burntdown, timer, clock, storage, $, chart) => {

        var todoClock = new clock.VirtualClock(new Date(Date.now()), 10000),
            todoTimer = new timer.Timer(todoClock, 2000),
            todoApp = new app.TodoBurntdownApplication({
                clock: todoClock,
                timer: todoTimer,
                todoSettings: new settings.SettingsViewModel(todoTimer, todoClock),
                todoList: new todo.TodoViewModel(),
                todoSummary: new summary.SummaryViewModel(),
                burtndownCalculations: new burntdown.BurntdownCalculation(),
                burntdownChart: new burntdownChart.BurntdownChartViewModel(),
                storage: new storage.SessionStorage()
            }, {
                todoListSelector: '#todoList',
                todoSettingsSelector: '#settings',
                todoSummarySelector: '#summary',
                burntdownChartSelector: '#chart',
                applicationSelector: '#app'
            });

        todoApp.run();
    });