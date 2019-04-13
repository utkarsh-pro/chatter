const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../../models/User');

// @route GET /api/chatter/test
// @desc Testing the protected route
// @access PRIVATE
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: 'success' });
});

// @route GET /api/chatter/friends
// @desc Send friends list
// @access PRIVATE
router.get('/friends', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user);
    User.findOne({ username: req.user.username })
        .then(response => res.send(response.friends))
});

// @route POST /api/chatter/friends
// @desc Testing the protected route
// @access PRIVATE
router.post('/friends', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.body);
    User.findOne({ username: req.body.username })
        .then(response => {
            const newFriend = req.body.friend;
            if (response.friends && response.friends.size > 0) {
                if (!response.friends.get(newFriend) ? true : false) {
                    response.friends.set(newFriend, []);
                    response.save()
                        .then(() => res.send({ msg: 'success' }))
                        .catch(err => console.log(err));
                } else {
                    res.send({ msg: 'Friend already existed' });
                }
            }
            else {
                const friends = { [newFriend]: [] };
                User.findOneAndUpdate({ username: response.username }, { friends })
                    .then(() => res.send(friends))
                    .catch(err => res.status(500).send({ msg: err }));
            }
        })
        .catch(err => console.log(err));
});

module.exports = router;