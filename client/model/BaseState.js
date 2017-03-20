/**
 * Базовый класс всех состояний
 */
export default class BaseState {
    socket = null;
    is_connection_fail = false;
    INTERVAL_RECONNECTION = 5000;

    init() {}

    constructor() {
        // return; // @TODO удалить
        let status = this.connectSocket();
        this.checkAndReconnectSocket();

        if (status) {
            this.init();
        }
    }

    connectSocket() {
        let self = this;
        try {
            this.socket = io.connect('http://localhost:3000');

            self.is_connection_fail = false;
            this.socket.on('connect', function() {
                self.is_connection_fail = false;
            });
            this.socket.on('disconnect', function() {
                self.is_connection_fail = true;
                self.checkAndReconnectSocket();
            });

            return true;
        } catch (e) {
            console.log('Нет соединения с сервером');
            this.is_connection_fail = true;
            setTimeout(function () {
                if (self.is_connection_fail) {
                    self.connectSocket();
                }
            }, self.INTERVAL_RECONNECTION);

            return false;
        }
    }

    checkAndReconnectSocket() {
        let self = this;
        setInterval(function () {
            if (!self.is_connection_fail) {
                return;
            }

            console.log('Пытаемся повторно подключиться к серверу');
            if (self.socket) {
                self.socket.io.reconnect();
            } else {
                if (confirm('Нет доступа к серверу, перезагрузить страницу?')) {
                    window.location.reload();
                }
            }
        }, self.INTERVAL_RECONNECTION);
    }

    emit(event_name, data = []) {
        if (this.is_connection_fail) {
            console.log('Не могу отправить запрос, нет соединения с сервером');
            return this;
        }

        this.socket.emit(event_name, data);

        return this;
    }

    on(event_name, cb) {
        if (this.is_connection_fail) {
            console.log('Нет соединения с сервером');
            return this;
        }

        this.socket.on(event_name, cb);

        return this;
    }

    bindEvents() {
        this.socket.on('system:reload', function () {
            setTimeout(function () {
                window.location.reload();
            }, 3000);
        })
    }
}