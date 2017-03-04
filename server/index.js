var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

var server = app.listen(3000, function () {
    console.log('server run http://localhost:3000/!');
});

var io = require('socket.io').listen(server);



var five = require("johnny-five");
var board = new five.Board();


board.on("ready", function() {
    var relay = new five.Relay(53);

    require('./socket')(io, relay);

    this.repl.inject({
        relay: relay
    });
});