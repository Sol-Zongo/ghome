import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'

@observer
export default class LeftPanel extends Component {
    render() {
        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    <li className="active">
                        <a href="#">Спальня</a>
                    </li>
                    <li> <Link to={`/module/1`}>Спальня</Link></li>
                    <li> <Link to={`/module/2`}>Зал</Link></li>
                    <li> <Link to={`/module/3`}>Детская</Link></li>
                    <li><a href="#">Коридор</a></li>
                    <li><a href="#">Ванна</a></li>
                    <li><a href="#">Туалет</a></li>
                </ul>
            </div>
        )
    }
}