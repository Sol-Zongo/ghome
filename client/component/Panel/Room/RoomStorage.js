import BaseState from '../../../model/BaseState';
import {observable} from 'mobx';

class RoomStorage extends BaseState {
    constructor() {
        super();

        this.current_module = this.default_module_data;
    }

    // список доступных модулей в системе, подгружаются в watchModules
    @observable modules = [];

    // данные для модуля по умолчанию
    default_module_data = {
        _id: '',
        name: '',
        port: '',
        module: '',
        type_pin: 'digital',
        is_enabled: false,
    };

    // текущий редактируемый или добавляемый модуль
    @observable current_module = {};

    /**
     * Загрузить данные модуля по умолчанию
     * @returns {ModuleStorage}
     */
    setDefaultModuleData() {
        this.current_module = this.default_module_data;

        return this;
    }

    /**
     * Загружаем и ожидаем новые модули
     */
    watchModules() {
        let self = this;
        this.emit('module:load_all')
            .on('module:watch', function (modules) {
                self.modules = modules;
            })
    }

    addNewModule(callback) {
        this.emit('module:add', this.current_module);

        this.on('module:add:success', function (msg) {
            callback(null, msg);
        });
        this.on('module:add:error', function (err) {
            callback(err);
        });
    }

    editModule(callback) {
        let self = this;
        this.emit('module:edit', this.current_module);

        this.on('module:edit:success', function (msg) {
            callback(null, msg);
            self.reload();
        });
        this.on('module:edit:error', function (err) {
            callback(err);
        });
    }

    findModuleById(id) {
        let self = this;
        this.emit('module:load', {id: id})
            .on('module:load:success', function (module) {
                console.log(module);
                self.current_module = module;
            })
            .on('module:load:error', function (err) {
                alert(err);
            })
    }

    removeModule(id) {
        let self = this;
        this.emit('module:remove', {_id: id});
        this.reload();
    }

    reload() {
        setTimeout(function () {
            window.location.reload();
        }, 3000);
    }
}

export let Storage = new RoomStorage();