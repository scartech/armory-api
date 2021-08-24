const express = require('express');
const router = express.Router();

const loginRoutes = require('./login.routes');

router.use('/', loginRoutes);

module.exports = router;
