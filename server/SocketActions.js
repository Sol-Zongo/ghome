var mongoose = require('mongoose');
var Module = require('./Mongo/Schema').Module;
var controller = require('./Controller');

module.exports = function (actions, socket, system_events) {
    // var actions = actions.setSystemEvents(system_events);
    var is_toggle = false;

    socket.on('my_toggle', function (data) {

        if (!is_toggle) {
            console.log('toggle_on');
            actions.getInstanceModules()['58bfe543953531be611d9ebf'].on();
        } else {
            console.log('toggle_off');
            actions.getInstanceModules()['58bfe543953531be611d9ebf'].off();
        }

        is_toggle = !is_toggle;
        socket.emit('toggle_info', {is_toggle: is_toggle});
    });



    socket.on('module:add', function (data) {
        actions.addNewModule(data.name, data.port, data.module, data.type_pin, data.is_enabled, {}, function (err, module_instance) {
            if (err) {
                socket.emit('module:add:error', err);
                return;
            }
            socket.emit('module:watch', actions.findAllModules());
            socket.emit('module:add:success');
        })
    });

    socket.on('module:edit', function (data) {
        actions.editModule(data._id, data.name, data.port, data.module, data.type_pin, data.is_enabled, {}, function (err, module_instance) {
            if (err) {
                socket.emit('module:edit:error', err);
                return;
            }
            socket.emit('module:watch', actions.findAllModules());
            socket.emit('module:edit:success');
        })
    });

    socket.on('module:remove', function (data) {
        actions.removeModule(data._id)
    });

    socket.on('module:load_all', function (data) {
        socket.emit('module:watch', actions.findAllModules())
    });

    socket.on('module:load', function (data) {
        actions.findModuleById(data.id, function (err, module) {
            if (err) {
                socket.emit('module:load:error', err);
                return;
            }
            socket.emit('module:load:success', module);
        });
    });


    system_events.on(controller.SYSTEM_EVENT_RELOAD, function () {
        socket.emit('system:reload');
    });
};
