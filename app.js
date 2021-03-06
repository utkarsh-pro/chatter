const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const mongoose = require('mongoose');
const Cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const Redis = require('ioredis');
const keys = require('./config/keys');
const signUp = require('./routes/api/signup');
const login = require('./routes/api/login');
const chatter = require('./routes/api/chatter');
const User = require('./models/User');

// Config rate limiter ==============================================
const rateLimit = new RateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100, // Limit number of requests per IP to 100
    delayMs: 0 // No delay
});

// ==================================================================
// Express config
app.use(Cors()); // Server setup for cors requests
app.use(express.static(path.join(__dirname, 'client', 'build')));
const PORT = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize()); // Initialises passport.js services
app.use(helmet()); // Use helmet for additional security
app.use(rateLimit); // Limit rate
//===================================================================
// DB config
// MongoDB
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.log(err));

// Redis
const redis = new Redis();

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

// @route GET /*
// @desc serve static files
// @access PUBLIC
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Chat Service **************************************************************************

const io = require('socket.io')(server);
io.on('connection', (socket) => {
    socket.on('connected', sender => {
        console.log('connected', socket.id);
        user = sender;
        redis.hmset(sender, 'id', socket.id);
    })
    socket.on('private', (msg) => {
        let socketId;
        redis.hgetall(msg.reciever).then(res => {
            console.log('Response', res['id']);
            socketId = res.id;
            console.log('message:', msg);
            console.log('SocketID:', socketId);
            // Send message to the user in real time
            io.to(`${socketId}`).emit('message', msg);
            // Store message into database for later retrieval --Sender
            User.findOne({ username: msg.sender })
                .then(res => {
                    const chatLog = res.friends.get(msg.reciever);
                    chatLog.push(msg);
                    res.friends.set(msg.reciever, chatLog);
                    res.save()
                        .then(res => console.log(res))
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            // Store message into database for later retrieval --Reciever
            User.findOne({ username: msg.reciever })
                .then(res => {
                    const chatLog = res.friends.get(msg.sender);
                    chatLog.push(msg);
                    res.friends.set(msg.sender, chatLog);
                    res.save()
                        .then(res => console.log(res))
                        .catch(err => console.log(err));
                })
                .catch(err => console.log(err));
        }).catch(err => console.log(err));
    });
    socket.on('disconnect', () => {
        console.log('Disconnected', socket.id);
    });
});

// ***************************************************************************************
server.listen(PORT, () => console.log("Server listening on port", PORT));