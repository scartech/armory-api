const express = require('express');
const passport = require('passport');

const router = express.Router();

const apiRoutes = require('./api');
const loginRoutes = require('./login');

router.use('/login', loginRoutes);
router.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);

module.exports = router;
