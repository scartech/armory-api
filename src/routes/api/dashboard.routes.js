const express = require('express');
const { DashboardController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/dashboard
 * @tags Dashboard
 * @summary Gets all dashboard data for the logged in user.
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - User's Dashboard Data
 * [{
 *   "gunCount": 20,
 *   "ammoCount": 25,
 *   "totalRoundCount": 2500
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', DashboardController.data);

module.exports = router;
