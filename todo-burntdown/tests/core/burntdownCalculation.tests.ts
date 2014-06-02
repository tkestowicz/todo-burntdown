import bc = require('src/core/burntdownCalculation');

var sutFactory = () => new bc.BurntdownCalculation(),
    actualBurntdownHistory = [{ day: 0, effort: 5 }, { day: 0, effort: 11 },
    { day: 1, effort: 11 }, { day: 2, effort: 11 }, { day: 3, effort: 14 },
    { day: 3, effort: 16 }, { day: 3, effort: 16 }, { day: 3, effort: 16 },
    { day: 4, effort: 21 }, { day: 4, effort: 25 }, { day: 4, effort: 25 },
    { day: 5, effort: 27 }, { day: 6, effort: 27 }, { day: 7, effort: 42 }];

QUnit.module('burntdown calculation');
test('ideal burntdown is calculated correctly', () => {

    var burntdown = sutFactory();

    burntdown.initialize({
        estimatedEffort: 49,
        sprintDurationInDays: 7
    });

    var idealCalculation = burntdown.idealBurntdownCalculation();

    var expectedCalculation = [{ day: 0, effort: 49 },
        { day: 1, effort: 42 }, { day: 2, effort: 35 },
        { day: 3, effort: 28 }, { day: 4, effort: 21 },
        { day: 5, effort: 14 }, { day: 6, effort: 7 },
        { day: 7, effort: 0 }];

    propEqual(idealCalculation, expectedCalculation);
});

test('actual burntdown is calculated correctly', () => {

    var burntdown = sutFactory(),
        actualBurntdown: bc.IBurntdownRecord[];

    burntdown.initialize({
        estimatedEffort: 49,
        sprintDurationInDays: 7
    });

    burntdown.actualBurntdownRecalulated = (burntdownHistory) => {
        actualBurntdown = burntdownHistory;
    };

    actualBurntdownHistory.forEach((record) => burntdown.actualBurntdownUpdated(record));

    var expectedBurntdown = [{ day: 0, effort: 38 }, { day: 1, effort: 38 },
        { day: 2, effort: 38 }, { day: 3, effort: 33 }, { day: 4, effort: 24 },
        { day: 5, effort: 22 }, { day: 6, effort: 22}, {day: 7, effort: 7}];

    propEqual(actualBurntdown, expectedBurntdown);
});

test('actual velocity is calculated correctly', () => {

    var burntdown = sutFactory(),
        actualVelocity = 0;

    burntdown.initialize({
        estimatedEffort: 49,
        sprintDurationInDays: 7
    });

    burntdown.actualBurntdownRecalulated = (burntdownHistory, velocity) => {
        actualVelocity = velocity;
    };

    actualBurntdownHistory.forEach((record) => burntdown.actualBurntdownUpdated(record));

    equal(actualVelocity, 6);
});