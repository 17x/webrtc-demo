import { io } from 'socket.io-client';

class Signaling{
    socket;
    status = 'disconnected';

    constructor({
        wsUrl = '192.168.0.123:3000',
        onSignalingOffer,
        onSignalingAnswer,
        onSignalingICE
    } = {}){
        return new Promise((resolve, reject) => {
            let socket;

            this.socket = io(
                wsUrl,
                {
                    transports : ['websocket']
                }
            );

            socket = this.socket;
            socket.on('connect', () => {
                console.log('socket connect');
                this.status = 'connected';
                resolve(this);
            });

            socket.on('disconnect', () => {
                console.log('socket disconnect');
                this.status = 'disconnected';
                reject();
            });

            socket.on('connect_error', (reason) => {
                console.log('socket connect_error');
                this.status = 'connect_error';
                reject();
            });

            socket.on('offer', onSignalingOffer);

            socket.on('answer', onSignalingAnswer);

            socket.on('ice', onSignalingICE);
        });

    }

    Join(studentId){
        this.socket.emit('apply-join', {
            studentId
        });
    }

    SendIce(message){
        console.log('send ice');
        this.socket.emit('ice', message);
    }

    SendOffer(message){
        console.log('send offer');
        this.socket.emit('offer', message);
    }

    SendAnswer(message){
        console.log('send answer',message);
        this.socket.emit('answer', message);
    }

    Emit(){

    }
}

/*
 const socket = io('192.168.0.123:3000', {
 transports : ['websocket']
 });

 let studentId = null;

 socket.on('disconnect', () => {
 console.log('socket disconnect');
 });

 socket.on('new member', (id) => {
 alert(id);
 });

 socket.emit('apply-join', {
 socketId : socket.id,
 studentId
 });

 socket.on('connect', () => {
 resolve(socket);
 // console.log(socket.id);
 console.log('socket connect');
 });

 socket.on('connect_error', (reason) => {
 /!*
 io server disconnect	The server has forcefully disconnected the socket with socket.disconnect()
 io client disconnect	The socket was manually disconnected using socket.disconnect()
 ping timeout	The server did not send a PING within the pingInterval + pingTimeout range
 transport close	The connection was closed (example: the user has lost connection, or the network was changed from WiFi to 4G)
 transport error	The connection has encountered an error (example: the server was killed during a HTTP long-polling cycle)
 *!/
 // socket.auth.token = "abcd";
 // socket.connect();

 reject(socket);
 });*/
export default Signaling;