import React, { Component } from 'react'
import { observer } from 'mobx-react'
import {panels} from './Panel/AutoloadPanels';
import { Route, Link } from 'react-router'

import {RENDER_TYPE_PANEL, RENDER_TYPE_CLIENT, RENDER_TYPE_SETTING} from './Panel/BasePanel';

// Класс отвечает за вывод всех доступных панелей в системе
@observer
export class SettingPanels extends Component {
    clickPanel(id) {
        this.props.router.push(`/setting/panel/${id}`);
    }

    render() {
        let self = this;
        let list = [];
        for (let id in panels) {
            const Panel = panels[id];
            list.push((
                <div className="col-md-4" key={id} onClick={self.clickPanel.bind(self, id)}>
                    <Panel render={RENDER_TYPE_PANEL}/>
                </div>
            ));
        }
        return (
            <div className="row">
                {list}
            </div>
        );
    }
}

// Выводит конкретную панель для ее настройки
export class Panel extends Component {
    render() {
        const Panel = panels[this.props.params.panelId];

        return (
            <Panel render={RENDER_TYPE_SETTING}/>
        );
    }
}
