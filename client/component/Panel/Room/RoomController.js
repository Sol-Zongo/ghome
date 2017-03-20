import React from 'react'
import BasePanel from '../BasePanel'
import {observer} from 'mobx-react';
import {Storage} from './RoomStorage';

@observer
export default class RoomController extends BasePanel {
    componentDidMount() {
        super.componentDidMount();

        this.state = {
            is_show_form_module: false,
            is_show_edit_module: false,
        };
    }


    renderSettingView() {
        return super.renderSettingView();
    }

    renderClientView() {
        return super.renderClientView();
    }

    renderPanelView() {
        return (
            <div className="panel">
                <div className="panel-heading">
                    <h3 className="panel-title">Помещения</h3>
                </div>
                <div className="panel-body">
                    Добавление помещений и т.п
                </div>
            </div>
        );
    }
}