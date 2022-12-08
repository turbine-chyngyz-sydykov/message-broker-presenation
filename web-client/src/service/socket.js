import { io } from 'socket.io-client';

export default class SocketService {
    channel = 'my-channel';
    constructor(channel, query = {}) {
        this.channel = channel;
        this.socket = io('ws://localhost:3000', {
            transports : ['websocket'],
            query
        });
    }
    send(message){
        this.socket.emit(this.channel, message);
    }

    subscribe(callback) {
        this.socket.on(this.channel, (data) => {
            callback(data);
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
