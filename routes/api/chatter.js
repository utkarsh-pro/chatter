const express = require('express');
const passport = require('passport');
const router = express.Router();
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const keys = require('../../config/keys');
// const User = require('../../models/User');
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));


// @route GET /api/chatter/test
// @desc Testing the protected route
// @access PRIVATE
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: 'success' });
});

// mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
//     .then(() => console.log('Successfully connected to the database'))
//     .catch(err => console.log(err));

// app.post('/test2', (req, res) => {
//     console.log(req.body);
//     const newUser = new User({
//         username: req.body.username,
//         password: req.body.password,
//         friends: {
//             friend1: [1, 3, 5],
//             friend2: [1, 2, 3]
//         }
//     });
//     newUser.save()
//         .then(user => res.json(user))
//         .catch(err => console.log(err));
// });

// User.findOneAndUpdate({ username: 'test2' }, { friends: { friend1: [1, 2, 3, 4, 200, 100000] } })
//     .then(user => console.log('success', user))
//     .catch(err => console.log(err));

// app.listen(6000, () => console.log('running!'));
module.exports = router;