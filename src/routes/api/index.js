const express = require('express');
const router = express.Router();

const gunRoutes = require('./gun.routes');

router.use('/guns', gunRoutes);

module.exports = router;
