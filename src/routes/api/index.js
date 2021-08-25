const express = require('express');
const router = express.Router();

const usersRoutes = require('./users.routes');
const gunsRoutes = require('./guns.routes');

router.use('/users', usersRoutes);
router.use('/guns', gunsRoutes);

module.exports = router;
