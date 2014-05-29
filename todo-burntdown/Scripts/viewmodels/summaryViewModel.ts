import ko = require("ko");
import todo = require('viewmodels/todoViewModel');

export class SummaryViewModel {

    workSummary = {
        expected: ko.observable(0),
        actual: ko.observable(0)
    };

    updateSummary = (summary: todo.IWorkSummary) => {

        this.workSummary.actual(summary.actual());
        this.workSummary.expected(summary.expected());
    }
}