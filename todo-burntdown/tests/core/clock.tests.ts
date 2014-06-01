/// <reference path="../../libs/typings/qunit/qunit.d.ts"/>
import clockModule = require('src/core/clock');

test("clock shows today's date", () => {

    var clock = new clockModule.Clock(),
        today = new Date(Date.now()).getDay();

    equal(clock.now().getDay(), today);
});