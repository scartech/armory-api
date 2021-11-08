const express = require('express');
const { AmmoInventoryController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/inventory/{id}
 * @tags Ammo Inventory
 * @summary Gets inventory by ID
 * @security BearerAuth
 * @param {integer} id.path - Inventory ID
 * @return {object} 200 - success
 * @example response - 200 - Existing Inventory
 * {
 *   "id": 0,
 *   "caliber": "9mm",
 *   "count": 250,
 *   "goal": 1000,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The inventory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', AmmoInventoryController.read);

/**
 * DELETE /api/inventory/{id}
 * @tags Ammo Inventory
 * @summary Deletes inventory by ID
 * @security BearerAuth
 * @param {integer} id.path - Inventory ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The inventory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', AmmoInventoryController.delete);

/**
 * PUT /api/inventory/{id}
 * @tags Ammo Inventory
 * @summary Updates inventory
 * @security BearerAuth
 * @param {integer} id.path - Inventory ID
 * @param {object} request.body.required - Inventory data
 * @example request - Existing inventory
 * {
 *   "id": 0,
 *   "caliber": "9mm",
 *   "goal": 1000,
 *   "userId": 1
 * }
 * @return {object} 200 - Updated existing inventory
 * @example response - 200 - Updated inventory
 * {
 *   "id": 0,
 *   "caliber": "9mm",
 *   "count": 250,
 *   "goal": 1000,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The inventory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', AmmoInventoryController.update);

/**
 * POST /api/inventory
 * @tags Ammo Inventory
 * @summary Creates new inventory item
 * @security BearerAuth
 * @param {object} request.body.required - Inventory info
 * @example request - New inventory
 * {
 *   "id": 0,
 *   "caliber": "9mm",
 *   "goal": 1000,
 *   "userId": 1
 * }
 * @return {object} 201 - Created new inventory
 * @example response - 201 - Created inventory
 * {
 *   "id": 0,
 *   "caliber": "9mm",
 *   "count": 250,
 *   "goal": 1000,
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/', AmmoInventoryController.create);

/**
 * GET /api/inventory
 * @tags Ammo Inventory
 * @summary Gets all inventory for the logged in user.
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - User's inventory
 * [{
 *   "id": 0,
 *   "caliber": "9mm",
 *   "count": 250,
 *   "goal": 1000,
 *   "userId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', AmmoInventoryController.all);

/**
 * GET /api/inventory/caliber/:caliber
 * @tags Ammo Inventory
 * @summary Gets all inventory of a specific caliber for the logged in user.
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - User's inventory
 * [{
 *   "id": 0,
 *   "caliber": "9mm",
 *   "count": 250,
 *   "goal": 1000,
 *   "userId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/caliber/:caliber', AmmoInventoryController.allForCaliber);

module.exports = router;
