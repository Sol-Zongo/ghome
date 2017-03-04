import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Button } from 'react-bootstrap'
import DevTools from 'mobx-react-devtools';

@observer
export default class Form extends Component {
    handleClick() {
        this.props.data.toggle();
    }
    render() {
        const data = this.props.data;

        return (
            <div>
                <Button bsSize="large" bsStyle="primary" onClick={this.handleClick.bind(this)}>{ data.is_toggle ? 'Toggled' : 'Not Toggled' }</Button>
                <DevTools />
            </div>
        )
    }
}