import React from 'react';
import { Router, Route, Link, browserHistory, IndexRoute } from 'react-router'

import '../../styles/index.scss';

import TopPanel  from './Navigation/TopPanel'
import LeftPanel  from './Navigation/LeftPanel'

import MainPanel  from './MainPanel'
import {Panel, SettingPanels}  from './Setting'

class App extends React.Component {
    componentDidMount() {
        $(document).ready(function () {
            $.material.init();
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <TopPanel/>
                <div className="row">
                    <div className="col-3">
                        <LeftPanel/>
                    </div>
                    <div className="col">
                        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default class Root extends React.Component {
    render() {
        return (
            <Router history={browserHistory}>
                <Route path='/' component={App}>
                    <IndexRoute component={MainPanel} />
                    <Route path='/setting' component={SettingPanels}/>
                    <Route path='/setting/panel/:panelId' component={Panel}/>
                </Route>
            </Router>
        );
    }
}