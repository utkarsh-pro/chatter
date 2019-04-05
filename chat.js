const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const users = [];

io.on('connection', (socket) => {
    console.log('connection established..', socket.id);
    socket.on('connected', data => {
        users.push({ sender: data.sender, reciever: data.reciever, id: socket.id });
        console.log(users);
    })
    socket.on('private', (msg) => {
        console.log(msg, socket.id);
        let socketId;
        users.forEach(user => {
            if (user.sender == msg.reciever) {
                return socketId = user.id;
            }
        })
        io.to(`${socketId}`).emit('hey', 'I just met you');
    });

    socket.on('disconnect', () => console.log('disconnected', socket.id))
});
