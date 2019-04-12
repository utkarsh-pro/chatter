const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const Cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const keys = require('./config/keys');
const signUp = require('./routes/api/signup');
const login = require('./routes/api/login');
const chatter = require('./routes/api/chatter');

// ==================================================================
// Express config
app.use(Cors()); // Server setup for cors requests
app.use(express.static(path.join(__dirname, 'client', 'build')));
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); // Initialises passport.js services

//===================================================================
// DB config
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.log(err));

//===================================================================
// Passport config
require('./config/passport-config')(passport);

//===================================================================
// Routes
app.use('/api/sign-up', signUp);
app.use('/api/login', login);
app.use('/api/chatter', chatter);

// @route GET api/test
// @desc return current user
// @access PRIVATE
app.get('/checkToken', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.sendStatus(200);
});

// Serving static files from the server due to client side routing I enabled in react
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Chat Service **************************************************************************

const io = require('socket.io')(server);
// This is solutions is temporary and is aimed to be relaced with cache memory (redis implementation)
const users = [];

io.on('connection', (socket) => {
    socket.on('connected', data => {
        users.push({ sender: data.sender, id: socket.id });
    })
    socket.on('private', (msg) => {
        let socketId;
        users.forEach(user => {
            if (user.sender == msg.reciever) {
                socketId = user.id;
            }
        });
        console.log(msg.private);
        io.to(`${socketId}`).emit('message', msg.private);
    });
});

// ***************************************************************************************
server.listen(PORT, () => console.log("Server listening on port", PORT));