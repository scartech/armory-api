const express = require('express');
const router = express.Router();

const gunRoutes = require('./gun.routes');
const historyRoutes = require('./history.routes');
const profileRoutes = require('./profile.routes');
const ammoRoutes = require('./ammo.routes');

router.use('/guns', gunRoutes);
router.use('/ammo', ammoRoutes);
router.use('/history', historyRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
