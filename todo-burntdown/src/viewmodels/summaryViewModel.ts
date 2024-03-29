﻿import todo = require('viewmodels/todoViewModel');

export interface ISummaryViewModelApi {
    updateSummary: (summary: todo.IWorkSummary) => void;
}

export class SummaryViewModel implements ISummaryViewModelApi{

    private workSummary = {
        expected: ko.observable(0),
        actual: ko.observable(0)
    };

    updateSummary = (summary: todo.IWorkSummary) => {

        this.workSummary.actual(summary.actual());
        this.workSummary.expected(summary.expected());
    }
}