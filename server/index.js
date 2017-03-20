var express = require('express');
var events = require('events');
var five = require("johnny-five");
var app = express();

app.get('/', function (req, res) {
    res.send('Добро пожаловать на сервер!');
});

var server = app.listen(3000, function () {
    console.log('server run http://localhost:3000/');
});

var io = require('socket.io').listen(server);

var board = new five.Board();

var system_events = new events.EventEmitter();

board.on("ready", function() {
    require('./Controller')(io, board, system_events);
});