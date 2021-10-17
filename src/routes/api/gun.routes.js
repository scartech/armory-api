const express = require('express');
const { GunController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/guns/images/{id}
 * @tags Guns
 * @summary Gets all images of a gun
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @return {object} 200 - success
 * @example response - 200 - Existing Gun
 * {
 *   "id": 0,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/images/:id/', GunController.readImages);

/**
 * GET /api/guns/images/{id}/{type}
 * @tags Guns
 * @summary Gets a single gun by ID
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @param {string} type.path - Image type (front, back, serial, receipt)
 * @return {object} 200 - success
 * @example response - 200 - Existing Gun
 * {
 *   "id": 0,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/images/:id/:type', GunController.readForImage);

/**
 * GET /api/guns/{id}
 * @tags Guns
 * @summary Gets a single gun by ID
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @return {object} 200 - success
 * @example response - 200 - Existing Gun
 * {
 *   "id": 0,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', GunController.read);

/**
 * DELETE /api/guns/{id}
 * @tags Guns
 * @summary Deletes a gun by ID
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', GunController.delete);

/**
 * PUT /api/guns/images/{id}
 * @tags Guns
 * @summary Updates images for a gun
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @param {object} request.body.required - Gun image data
 * @example request - Existing Gun
 * {
 *   "frontImage": "https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image",
 *   "backImage": "https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image",
 *   "serialImage": "https://fakeimg.pl/440x230/282828/eae0d0/?retina=1&text=No%20Image"
 * }
 * @return 200 - Success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/images/:id', GunController.updateImages);

/**
 * PUT /api/guns/{id}
 * @tags Guns
 * @summary Updates a gun
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @param {object} request.body.required - Gun data
 * @example request - Existing Gun
 * {
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return {object} 200 - Updated an existing gun
 * @example response - 200 - Updated Gun
 *  {
 *   "id": 1,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', GunController.update);

/**
 * POST /api/guns
 * @tags Guns
 * @summary Creates a new gun
 * @security BearerAuth
 * @param {object} request.body.required - Gun info
 * @example request - New Gun Info
 * {
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return {object} 201 - Created a new gun
 * @example response - 201 - Created Gun
 *  {
 *   "id": 1,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post('/', GunController.create);

/**
 * GET /api/guns
 * @tags Guns
 * @summary Gets all guns for the logged in user.
 * @security BearerAuth
 * @return {object} 200 - success
 * @example response - 200 - User's Guns
 * [{
 *   "id": 0,
 *   "name": "Shield",
 *   "serialNumber": "0000000",
 *   "modelName": "M&P Shield 2.0",
 *   "manufacturer": "Smith & Wesson",
 *   "caliber": "9mm",
 *   "type": "Pistol",
 *   "action": "Semi Automatic",
 *   "dealer": "PSA",
 *   "ffl": "PSA",
 *   "purchasePrice": 399,
 *   "purchaseDate": "2021-08-30",
 *   "buyer": "John Doe",
 *   "salePrice": 400,
 *   "saleDate": "2021-08-30",
 *   "picture": "",
 *   "userId": 1
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', GunController.guns);

module.exports = router;
