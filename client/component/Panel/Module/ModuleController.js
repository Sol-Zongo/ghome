import React from 'react'
import BasePanel from '../BasePanel'
import {observer} from 'mobx-react';
import {Storage} from './ModuleStorage';

@observer
export default class ModuleController extends BasePanel {
    componentDidMount() {
        super.componentDidMount();

        Storage.watchModules();

        this.state = {
            is_show_form_module: false,
            is_show_edit_module: false,
        };
    }

    getFormNewAndEditModule() {
        return (
            <form className="form-horizontal">
                <fieldset>
                    <legend>Новый модуль</legend>
                    <div className="form-group is-empty">
                        <label htmlFor="name" className="col-md-2 control-label">Название</label>

                        <div className="col-md-10">
                            <input value={ Storage.current_module.name } onChange={ this.handleInputChange.bind(this, 'name')} type="text" className="form-control" id="name" placeholder="Применение модуля в системе"/>
                        </div>
                    </div>
                    <div className="form-group is-empty">
                        <label htmlFor="module" className="col-md-2 control-label">Название модуля</label>

                        <div className="col-md-10">
                            <input value={ Storage.current_module.module } onChange={ this.handleInputChange.bind(this, 'module')} type="text" className="form-control" id="module" placeholder="Модуль из библиотеки"/>
                        </div>
                    </div>
                    <div className="form-group is-empty">
                        <label htmlFor="port" className="col-md-2 control-label">Порт модуля</label>

                        <div className="col-md-10">
                            <input value={ Storage.current_module.port } onChange={ this.handleInputChange.bind(this, 'port')} type="text" className="form-control" id="module" placeholder="В какой порт подключен"/>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="type_pin" className="col-md-2 control-label">Тип пина</label>
                        <div className="col-md-10">
                            <select value={ Storage.current_module.type_pin } onChange={ this.handleInputChange.bind(this, 'type_pin')} id="type_pin" className="form-control">
                                <option value='digital'>digital</option>
                                <option value='analog'>analog</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="col-md-offset-2 col-md-10">
                            <div className="checkbox">
                                <label>
                                    <input type="checkbox" checked={ Storage.current_module.is_enabled } onChange={ this.handleInputChange.bind(this, 'is_enabled')} id="is_enabled"/><span className="checkbox-material"><span className="check"></span></span> Подключен
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className="form-group">
                        <div className="col-md-10 col-md-offset-2">
                            <button type="button" className="btn btn-default" onClick={this.hideFormModule.bind(this)}>Отмена</button>
                            <button type="submit" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>
                                {Storage.current_module._id ? 'Сохранить' : 'Добавить'}
                            </button>
                        </div>
                    </div>
                </fieldset>
            </form>
        )
    }

    showFormNewModule() {
        Storage.setDefaultModuleData();
        this.setState({is_show_form_module: true});
    }

    hideFormModule() {
        this.setState({is_show_form_module: false});
    }

    handleInputChange(type, e) {
        let value = '';
        if (type == 'is_enabled') {
            value = e.target.checked;
        } else {
            value = e.target.value;
        }

        Storage.current_module[type] = value;
    }

    handleSubmit(e) {
        let self = this;
        if (Storage.current_module._id) {
            Storage.editModule(function (err, msg) {
                if (err) {
                    alert(err);
                    return;
                }

                self.hideFormModule();
                Storage.emit('system:reload');
            });
        } else {
            Storage.addNewModule(function (err, msg) {
                if (err) {
                    alert(err);
                    return;
                }

                self.hideFormModule();
            });
        }

        e.preventDefault();
    }

    editModule(id) {
        Storage.findModuleById(id);
        this.setState({is_show_form_module: true});
    }

    removeModule(id) {
        Storage.removeModule(id);
    }

    renderSettingView() {
        let self = this;
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <a href="#" className={"btn btn-primary btn-raised btn-lg active pull-right" + (this.state.is_show_form_module ? ' hidden' : ' show')} onClick={this.showFormNewModule.bind(this)} role="button">Добавить новый модуль</a>
                        {this.state.is_show_form_module ? this.getFormNewAndEditModule() : ''}
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-body">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th width='20%'>ID</th>
                                <th width='40%'>Название</th>
                                <th width='10%'>Порт</th>
                                <th width='20%'>Модуль</th>
                                <th width='10%'>Действие</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Storage.modules.map(function (module) {
                                return (
                                    <tr key={module._id}>
                                        <th scope="row">{module._id}</th>
                                        <td>{module.name}</td>
                                        <td>{module.port}</td>
                                        <td>{module.module}</td>
                                        <td>
                                            <div className="btn-group">
                                                <button type="button" onClick={this.editModule.bind(this, module._id)} className="btn btn-fab btn-fab-mini">
                                                    <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                                                    <div className="ripple-container"></div>
                                                </button>

                                                <button type="button" onClick={this.removeModule.bind(this, module._id)} className="btn btn-fab btn-fab-mini">
                                                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
                                                    <div className="ripple-container"></div>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }, this)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    renderPanelView() {
        return (
            <div className="panel">
                <div className="panel-heading">
                    <h3 className="panel-title">Настройка модулей</h3>
                </div>
                <div className="panel-body">
                    Добавить новый в систему, или отредактировать.
                </div>
            </div>
        )
    }
}
