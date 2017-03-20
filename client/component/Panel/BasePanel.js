import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'

export const RENDER_TYPE_SETTING = 1;
export const RENDER_TYPE_CLIENT  = 2;
export const RENDER_TYPE_PANEL   = 3;

export const ID   = 4;

@observer
export default class BasePanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            render : RENDER_TYPE_CLIENT
        };
    }

    componentDidMount() {
        this.setState({ render: this.props.render });
    }

    /**
     * Вьюшка для настройки в админке
     */
    renderSettingView() {
        return (
            <h2>Setting content</h2>
        );
    }

    /**
     * Вьюшка для клиентской стороны
     */
    renderClientView() {
        return (
            <h2>Client content</h2>
        );
    }

    /**
     * Вьюшка для панельки в админке
     */
    renderPanelView() {
        return (
            <div className="panel">
                <div className="panel-heading">
                    <h3 className="panel-title">Panel name</h3>
                </div>
                <div className="panel-body">
                    Panel content
                </div>
            </div>
        );
    }

    render() {
        switch (this.state.render) {
            case RENDER_TYPE_CLIENT:
                return this.renderClientView();
            case RENDER_TYPE_SETTING:
                return this.renderSettingView();
            case RENDER_TYPE_PANEL:
                return this.renderPanelView();
        }

        return this.renderClientView();
    }
}