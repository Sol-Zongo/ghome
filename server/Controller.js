var five = require("johnny-five");
var mongoose = require('mongoose');
var Sync = require('sync');

var Module = require('./Mongo/Schema').Module;
var create = require('./Helper').create;

var SYSTEM_EVENT_NAME = 'server_info',
    SYSTEM_EVENT_MODULE_SUCCESS_LOADED = 'modules_load_success',
    SYSTEM_EVENT_MODULE_ERROR_LOADED = 'modules_error_success',
    SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED = 'new_module_add_success',
    SYSTEM_EVENT_NEW_MODULE_ERROR_ADDED = 'new_module_add_error',
    SYSTEM_EVENT_RELOAD = 'system_reload';

var available_system_events = [
    SYSTEM_EVENT_NAME,
    SYSTEM_EVENT_MODULE_SUCCESS_LOADED,
    SYSTEM_EVENT_MODULE_ERROR_LOADED,
    SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED,
    SYSTEM_EVENT_NEW_MODULE_ERROR_ADDED,
    SYSTEM_EVENT_RELOAD
];


module.exports.SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED = SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED;
module.exports.SYSTEM_EVENT_RELOAD = SYSTEM_EVENT_RELOAD;

module.exports = function (io, board, system_events) {

    actions.init().setSystemEvents(system_events).setBoard(board).bindsEvents().loadModules();

    io.on('connection', function (socket) {
        console.log('A user connected');

        // регистируем все наши доступные экшены
        require('./SocketActions')(actions, socket, system_events);

        // вешаемся на все доступные системные события, для проксирования их клиенту
        available_system_events.forEach(function (event_name) {
            system_events.on(event_name, function (data) {
                console.log('SYSTEM_EVENT----', event_name, data);
                socket.emit(event_name, data);
            });
        });

        system_events.on(SYSTEM_EVENT_MODULE_SUCCESS_LOADED, function (msg) {
            socket.emit('module:watch', actions.findAllModules());
        });
    });
};



var actions = {
    /**
     * Установить системные уведомления
     * @param system_events
     */
    setSystemEvents: function (system_events) {
        this.system_events = system_events;
        return this;
    },

    /**
     * Установить ардуино
     * @param board
     */
    setBoard: function (board) {
        this.board = board;
        return this;
    },

    init: function () {
        this.system_events = null;
        this.board = null;
        this.cache_modules = [];
        this.instance_modules = {};
        return this;
    },

    /**
     * Получить зарегистированные модули в системе
     * @returns {{}|*}
     */
    getInstanceModules: function () {
        return this.instance_modules;
    },

    /**
     * Добавить в систему новый модуль
     * @param name
     * @param port
     * @param new_module
     * @param type_pin
     * @param is_enabled
     * @param default_value
     * @param callback
     */
    addNewModule: function (name, port, new_module, type_pin, is_enabled, default_value = {}, callback) {
        var self = this;

        Module.find({port: port}, function (err, module) {
            if (module.length) {
                var exist_module = module.pop();
                var text_err = 'Не удалось добавить модуль порт под номером '+port+' занят модулем - ' + exist_module.name;
                self.system_events.emit(
                    SYSTEM_EVENT_NEW_MODULE_ERROR_ADDED,
                    {text: text_err, detail: err}
                );

                callback(text_err);
            } else {
                Module.create({
                    name: name,
                    port: port,
                    module: new_module,
                    _id: new mongoose.Types.ObjectId,
                    type_pin: type_pin,
                    is_enabled: is_enabled,
                    value: default_value
                }, function (err, new_module) {
                    if (err) {
                        self.system_events.emit(SYSTEM_EVENT_NEW_MODULE_ERROR_ADDED, {text: 'Не удалось добавить модуль', detail: err});
                    }

                    self.cache_modules.push(new_module);
                    self.system_events.emit(SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED, new_module);
                    callback(null, new_module);
                });
            }
        });
    },

    /**
     * Редактировать модуль
     * @param id
     * @param name
     * @param port
     * @param new_module
     * @param type_pin
     * @param is_enabled
     * @param default_value
     * @param callback
     */
    editModule: function (id, name, port, new_module, type_pin, is_enabled, default_value = {}, callback) {
        var self = this;

        var promise = Module.findOne({_id: id}).exec();

        promise.then(function (module) {
            module.name = name;
            module.port = port;
            module.module = new_module;
            module.type_pin = type_pin;
            module.is_enabled = is_enabled;
            module.value = default_value;

            return module.save();
        })
        .then(function (module) {
            self.reloadModules();
            callback(null, module);
        })
        .catch(function (err) {
            callback(err);
        });
    },

    /**
     * Загрузить в систему все модули найденные в БД
     */
    loadModules: function () {
        var self = this;
        Module.find({}, function (err, modules) {
            if (err || modules.length == 0) {
                self.system_events.emit(SYSTEM_EVENT_MODULE_ERROR_LOADED, {
                    text: 'Зарегистрированные модули не найдены',
                    details: err
                });

                return;
            }

            var count_registered_modules = 0;
            modules.forEach(function(module) {
                self.cache_modules.push(module);
                if (module.is_enabled) {
                    self.registerModule(module);
                    count_registered_modules++;
                }
            });

            self.system_events.emit(SYSTEM_EVENT_MODULE_SUCCESS_LOADED, {
                text: 'Все модули арегистрированны ('+count_registered_modules+')'
            });
        });
    },

    /**
     * Зарегистрировать модуль в системе, для дальнейшей работы с ним клиентам
     *
     * @param {Module} module
     */
    registerModule: function (module) {
        var five_module = create(five[module.module], module.port);
        var module_item = {};
        module_item[module.module] = five_module;
        this.board.repl.inject(module_item);

        this.instance_modules[module._id] = five_module;
    },

    /**
     * Найти все модули в бд
     * @returns {Array}
     */
    findAllModules: function () {
        // берем из закешированного массива модулей, чтобы не делать лишний запрос
       return this.cache_modules;
    },

    /**
     * Найти модуль по ID
     * @param id
     * @param callback
     */
    findModuleById: function (id, callback) {
        Module.findOne({_id: id}, function (err, module) {
            callback(err, module);
        });
    },

    /**
     * Удалить модуль
     * @param id
     */
    removeModule: function (id) {
        var self = this;
        var promise = Module.find({ _id: id }).remove().exec();
        promise.then(function () {
            self.reloadModules();
        });
    },

    reloadModules: function () {
        this.system_events.emit(SYSTEM_EVENT_RELOAD);
        this.board.repl.close();
    },

    /**
     * Следим за разыными событиями
     */
    bindsEvents: function () {
        var self = this;
        // следим за новым модулем
        self.system_events.on(SYSTEM_EVENT_NEW_MODULE_SUCCESS_ADDED, function (new_module) {
            if (new_module.is_enabled) {
                self.registerModule(new_module);
            }
        });

        return this;
    }
};