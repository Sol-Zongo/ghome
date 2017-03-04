module.exports = function (io, relay) {
    io.on('connection', function (socket) {
        console.log('A user connected');

        var is_toggle = false;

        socket.on('my_toggle', function (data) {

            if (!is_toggle) {
                console.log('toggle_on');
                relay.on();
            } else {
                console.log('toggle_off');
                relay.off();
            }

            is_toggle = !is_toggle;
            socket.emit('toggle_info', {is_toggle: is_toggle});
        });
    });
};