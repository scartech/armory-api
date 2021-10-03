const express = require('express');
const { AmmoController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/ammo/{id}
 * @tags Ammo
 * @summary Gets ammo by ID
 * @security BearerAuth
 * @param {integer} id.path - Ammo ID
 * @return {object} 200 - success
 * @example response - 200 - Existing Ammo
 * {
 *   "id": 0,
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The ammo was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', AmmoController.read);

/**
 * DELETE /api/ammo/{id}
 * @tags Ammo
 * @summary Deletes ammo by ID
 * @security BearerAuth
 * @param {integer} id.path - Ammo ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The ammo was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', AmmoController.delete);

/**
 * PUT /api/ammo/{id}
 * @tags Ammo
 * @summary Updates ammo
 * @security BearerAuth
 * @param {integer} id.path - Ammo ID
 * @param {object} request.body.required - Ammo data
 * @example request - Existing Ammo
 * {
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }
 * @return {object} 200 - Updated existing ammo
 * @example response - 200 - Updated ammo
 *  {
 *   "id": 0,
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The ammo was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', AmmoController.update);

/**
 * POST /api/ammo
 * @tags Ammo
 * @summary Creates new ammo
 * @security BearerAuth
 * @param {object} request.body.required - Ammo info
 * @example request - New Ammo Info
 * {
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }
 * @return {object} 201 - Created new ammo
 * @example response - 201 - Created ammo
 *  {
 *   "id": 0,
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/', AmmoController.create);

/**
 * GET /api/ammo
 * @tags Ammo
 * @summary Gets all ammo for the logged in user.
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - User's Ammo
 * [{
 *   "id": 0,
 *   "name": "Range Pack",
 *   "brand": "0000000",
 *   "caliber": "9mm",
 *   "weight": "120 grain",
 *   "bulletType": "Centerfire",
 *   "muzzleVelocity": "200 f/s",
 *   "purchasedFrom": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "roundCount": 1000,
 *   "pricePerRound": 0.10,
 *   "userId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', AmmoController.ammo);

module.exports = router;
