/// <reference path="../libs/typings/jquery/jquery.d.ts"/>
import todo = require('viewmodels/todoViewModel');
import settings = require('viewmodels/settingsViewModel');
import summary = require('viewmodels/summaryViewModel');
import burntdownChart = require('viewmodels/burntdownChartViewModel');
import burntdown = require('core/burntdownCalculation');
import timer = require('core/timer');
import clock = require('core/clock');
import storage = require('core/storage');

export class TodoBurntdownApplication {

    private autosaveIntervalId: number;

    private isRunning = false;

    constructor(private dependencies: ITodoBurntdownDependencies,
        private selectors: IViewComponentsSelectors) {
        this.setup();
    }

    private setup() {
        this.bindStorageListeners();
        this.bindHandlers();
    }

    private bindStorageListeners() {
        this.dependencies.storage.listeners.push(this.dependencies.clock);
        this.dependencies.storage.listeners.push(this.dependencies.todoSettings);
        this.dependencies.storage.listeners.push(this.dependencies.todoList);
        this.dependencies.storage.listeners.push(this.dependencies.burtndownCalculations);
        this.dependencies.storage.listeners.push(this.dependencies.burntdownChart);
        this.dependencies.storage.listeners.push(this.dependencies.timer);        
    }

    private bindHandlers() {
        this.dependencies.timer.intervalElapsed = this.dependencies.todoList.burntdownProgressChanged;
        this.dependencies.timer.stopped = this.dependencies.todoSettings.stop;
        this.dependencies.todoSettings.createNewTodoItemHandler = this.dependencies.todoList.newTodoItem;
        this.dependencies.todoSettings.isTodoListValid = this.dependencies.todoList.validate;
        this.dependencies.todoSettings.stateChanged = (isRunning: boolean) => {

            this.dependencies.todoList.toogleAccessibility(isRunning);

            if (isRunning === true) {

                this.dependencies.burtndownCalculations.reset();
                this.dependencies.burntdownChart.reset();

                this.dependencies.burtndownCalculations.initialize({
                    estimatedEffort: this.dependencies.todoList.workSummary.expected(),
                    sprintDurationInDays: this.dependencies.todoSettings.duration()
                });

                this.dependencies.burntdownChart.render(this.dependencies.burtndownCalculations.idealBurntdownCalculation());

            }
        };
        this.dependencies.todoList.valuesUpdated = this.dependencies.todoSummary.updateSummary;
        this.dependencies.todoList.reportBurntdownProgress = this.dependencies.burtndownCalculations.actualBurntdownUpdated;

        this.dependencies.burtndownCalculations.actualBurntdownRecalulated = this.dependencies.burntdownChart.updateActual;

        this.dependencies.todoSettings.bindResetHandler(this.dependencies.todoList);
        //this.dependencies.todoSettings.bindResetHandler(this.dependencies.burtndownCalculations);
        this.dependencies.todoSettings.bindResetHandler(this.dependencies.burntdownChart);
    }

    private bindViewModels() {
        ko.applyBindings(this.dependencies.todoSettings, $(this.selectors.todoSettingsSelector)[0]);
        ko.applyBindings(this.dependencies.todoList, $(this.selectors.todoListSelector)[0]);
        ko.applyBindings(this.dependencies.todoSummary, $(this.selectors.todoSummarySelector)[0]);
        ko.applyBindings(this.dependencies.burntdownChart, $(this.selectors.burntdownChartSelector)[0]);
    }

    private unbindViewModels() {
        ko.cleanNode($(this.selectors.todoSettingsSelector)[0]);
        ko.cleanNode($(this.selectors.todoListSelector)[0]);
        ko.cleanNode($(this.selectors.todoSummarySelector)[0]);
        ko.cleanNode($(this.selectors.burntdownChartSelector)[0]);
    }

    public run() {

        if (this.isRunning === true) return;

        this.bindViewModels();

        this.dependencies.storage.load();

        if (location.search.indexOf("debug") === -1)
            this.autosaveIntervalId = setInterval(() => this.dependencies.storage.save(), 200);

        $(this.selectors.applicationSelector).css('display', 'block');

        this.isRunning = true;
    }

    public stop() {

        if (this.isRunning === false) return;

        this.unbindViewModels();

        clearInterval(this.autosaveIntervalId);

        $(this.selectors.applicationSelector).css('display', 'none');

        this.isRunning = false;
    }
} 

export interface ITodoBurntdownDependencies {
    todoList: todo.ITodoViewModelApi;
    todoSettings: settings.ISettingsViewModelApi;
    todoSummary: summary.ISummaryViewModelApi;
    burntdownChart: burntdownChart.IBurntdownChartViewModelApi;
    burtndownCalculations: burntdown.IBurntdownCalculation;
    timer: timer.ITimer;
    clock: clock.IClock;
    storage: storage.IStorageApi;
}

export interface IViewComponentsSelectors {
    todoListSelector: string;
    todoSettingsSelector: string;
    todoSummarySelector: string;
    burntdownChartSelector: string;
    applicationSelector: string;
}