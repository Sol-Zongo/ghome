import { observable } from 'mobx'

const socket = io.connect('http://localhost:3000');

export default class State {
    @observable is_saving = false;
    @observable is_toggle = false;
    toggle() {
        this.is_saving = true;

        console.log('toggle_client');
        socket.emit('my_toggle');
    }
    constructor() {
        let self = this;
        socket.on('toggle_info', function (data) {
            console.log('toggle_info', data);
            self.is_toggle = data.is_toggle;
            self.is_saving = false;
        });
    }
}