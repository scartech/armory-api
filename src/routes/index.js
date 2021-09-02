const express = require('express');
const passport = require('passport');

const router = express.Router();

const { UserMiddlewares } = require('../middlewares');
const apiRoutes = require('./api');
const loginRoutes = require('./login');
const adminRoutes = require('./admin');

router.use('/login', loginRoutes);
router.use('/api', passport.authenticate('jwt', { session: false }), apiRoutes);
router.use(
  '/admin',
  passport.authenticate('jwt', { session: false }),
  UserMiddlewares.verifyAdminAccess,
  adminRoutes,
);

module.exports = router;
