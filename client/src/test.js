import io from 'socket.io-client';
const socket = io.connect('http://localhost:5000');

const test = (sender, reciever) => {
    socket.emit('connected', { sender, reciever });
    socket.on('random', msg => console.log(msg));
}

const test2 = (sender, reciever, msg) => {
    socket.emit('privatemsg', { private: msg, sender, reciever });
    socket.on('hey', msg => console.log(msg));

}

export { test, test2 }