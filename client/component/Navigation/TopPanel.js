import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'

@observer
export default class PageHeader extends Component {
    render() {
        return (
            <div className="navbar navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-material-light-blue-collapse">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to={`/`}>G-Home</Link>
                    </div>
                    <div className="navbar-collapse collapse navbar-material-light-blue-collapse">
                        <ul className="nav navbar-nav">
                            <li className="active">
                                <Link to='/about'>About</Link>
                            </li>
                            <li>
                                <Link to='/module'>Module all</Link>
                            </li>
                        </ul>

                        <ul className="nav navbar-nav navbar-right">
                            <li><Link className="btn btn-raised btn-info" to='/setting'>Настройки</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}