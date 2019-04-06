const jwtStrategy = require('passport-jwt').Strategy;
const extractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const secretOrKey = require('./keys').secretOrKey;

const opts = {}
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretOrKey;

module.exports = passport => {
    passport.use(new jwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) done(null, user);
                else done(null, false);
            })
            .catch(err => console.log(err));
    }));
}