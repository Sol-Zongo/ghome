import React from 'react';

import '../../styles/index.scss';

import State from '../model/State.js'
import Form from './Form.jsx';

const data = new State();

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Form data={data}/>
            </div>
        )
    }
}
