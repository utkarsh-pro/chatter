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
// Setup server for CORS
app.use(Cors());

// Serving static react files
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Port setup
const PORT = process.env.PORT || 5000;

// Body Parser (Now builtin express-4.16.0)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//===================================================================
// DB config
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Successfully connected to the database'))
    .catch(err => console.log(err));

//===================================================================
// Passport config
app.use(passport.initialize());

// Passport config
require('./config/passport-config')(passport);

//===================================================================

app.use('/api/sign-up', signUp);
app.use('/api/login', login);
app.use('/api/chatter', chatter);

// @route GET api/test
// @desc return current user
// @access PRIVATE
app.get('/api/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});

// Serving static files from the server due to client side routing I enabled in react
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});


server.listen(PORT, () => console.log("Server listening on port", PORT));