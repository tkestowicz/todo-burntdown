/// <reference path="typings/jquery/jquery.d.ts"/>
import todo = require('viewmodels/todoViewModel');

$(() => {
    ko.applyBindings(new todo.TodoViewModel(), $('body')[0]);
});