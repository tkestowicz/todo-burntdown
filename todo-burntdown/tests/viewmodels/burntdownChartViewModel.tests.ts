import burntdown = require('src/viewmodels/burntdownChartViewModel');

test("burntdown chart view model exists", () => {

    var vm = new burntdown.BurntdownChartViewModel();

    notEqual(vm, null);
}); 