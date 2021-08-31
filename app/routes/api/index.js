const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const gunRoutes = require('./gun.routes');

router.use('/users', userRoutes);
router.use('/guns', gunRoutes);

module.exports = router;
