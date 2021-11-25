const express = require('express');
const { AccessoryController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/accessory
 * @tags Accessory
 * @summary Gets all accessories for a user
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - array of accessories
 * [{
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', AccessoryController.all);

/**
 * GET /api/accessory/{id}
 * @tags Accessory
 * @summary Gets a single accessory by ID
 * @security BearerAuth
 * @param {integer} id.path - Accessory ID
 * @return {object} 200 - success
 * @example response - 200 - Existing Accessory
 * {
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The accessory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', AccessoryController.read);

/**
 * DELETE /api/accessory/{id}
 * @tags Accessory
 * @summary Deletes an accessory
 * @security BearerAuth
 * @param {integer} id.path - Accessory ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The accessory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', AccessoryController.delete);

/**
 * PUT /api/accessory/{id}
 * @tags Accessory
 * @summary Updates an accessory
 * @security BearerAuth
 * @param {integer} id.path - Accessory ID
 * @param {object} request.body.required - Accessory data
 * @example request - Existing Accessory
 * {
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }
 * @return {object} 200 - Updated an existing accessory
 * @example response - 200 - Updated Accessory
 *  {
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The accessory was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', AccessoryController.update);

/**
 * POST /api/accessory
 * @tags Accessory
 * @summary Creates a new accessory
 * @security BearerAuth
 * @param {object} request.body.required - Accessory info
 * @example request - New Accessory
 * {
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }
 * @return {object} 201 - Created a new accessory
 * @example response - 201 - Created Accessory
 *  {
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/', AccessoryController.create);

/**
 * GET /api/accessory/gun/{id}
 * @tags Accessory
 * @summary Gets all accessories for a gun
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - Accessory
 * [{
 *   "id": 0,
 *   "type": "SLING",
 *   "serialNumber": "000000",
 *   "modelName": "Sling ABC",
 *   "manufacturer": "Acme",
 *   "count": 1,
 *   "notes": "Great sling",
 *   "country": "USA",
 *   "storageLocation": "Closet shelf",
 *   "purchasePrice": 10.99,
 *   "purchaseDate": "2010-11-20",
 *   "manufactureYear": "2018",
 *   "gunIds": [1, 2]
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/gun/:id', AccessoryController.gun);

module.exports = router;
