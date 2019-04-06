const express = require('express');
const passport = require('passport');
const router = express.Router();

// @route GET /api/chatter/test
// @desc Testing the protected route
// @access PRIVATE
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: 'success' });
});

module.exports = router;