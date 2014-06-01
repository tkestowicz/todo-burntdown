import virtualClock = require('src/core/virtualClock');

QUnit.module('virtual clock');

asyncTest('ticks correctly from now', () => {

    var currentDate = new Date(Date.now()),
        clock = new virtualClock.VirtualClock(currentDate, 2);

    setTimeout(() => {
        start();

        var expectedDate = currentDate.getDate() + 2 * 1000 * 3600 * 24;

        equal(clock.now().valueOf(), expectedDate);

    }, 5);
});