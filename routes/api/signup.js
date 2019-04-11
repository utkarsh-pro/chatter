const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../../models/User');
const router = express.Router();

// @route POST /api/sign-up
// @desc return user
// @access PUBLIC
router.post('/', (req, res) => {

    User.findOne({ username: req.body.username })
        .then(user => {
            if (user) {
                return res.status(400).json({ errors: 'Username already exists' });
            }
            else {
                const newUser = new User({
                    username: req.body.username,
                    password: req.body.password
                });
                const hashRounds = 10;
                bcrypt.genSalt(hashRounds, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
        .catch(err => console.log(err));
})

module.exports = router;