const express = require('express');
const { check } = require('express-validator');
const { ProfileController } = require('../../controllers');

const router = express.Router();

/**
 * GET /api/profile
 * @tags Profile
 * @summary Gets a the user's profile.
 * @security BearerAuth
 * @return {array<object>} 200 - success
 * @example response - 200 - User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "totpKeyEnabled": true
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', ProfileController.read);

/**
 * GET /api/profile/totp
 * @tags Profile
 * @summary Create a new TOTP key.
 * @security BearerAuth
 * @return {array<object>} 200 - success
 * @example response - 200 - Key
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "totpKeyEnabled": true
 * }
 * @return 401 - Invalid or missing JWT
 */
router.post('/totp', ProfileController.refreshTotp);

/**
 * GET /api/profile/validatetotp
 * @tags Profile
 * @summary Validate a TOTP token.
 * @security BearerAuth
 * @param {object} request.body.required - Token
 * @example request - Existing User
 * {
 *   "code": "123456"
 * }
 * @return {object} 200 - User who validated TOTP code
 * @example response - 200 - Updated User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "totpKeyEnabled": true
 * }
 * @return 401 - Invalid or missing JWT
 */
router.post('/validatetotp', ProfileController.validateTotp);

/**
 * PUT /api/profile
 * @tags Profile
 * @summary Updates an existing user
 * @security BearerAuth
 * @param {object} request.body.required - User data
 * @example request - Existing User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "totpKeyEnabled": true
 * }
 * @return {object} 200 - Updated an existing user
 * @example response - 200 - Updated User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "totpKeyEnabled": true
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 400 - Missing or invalid parameters
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/', ProfileController.update);

/**
 * PUT /api/profile/password
 * @tags Profile
 * @summary Updates a user's password
 * @security BearerAuth
 * @param {object} request.body.required - Password data
 * @example request - Password Payload
 * {
 *   "password": "secretpassword"
 * }
 * @return 200 - Success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put(
  '/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  ProfileController.updatePassword,
);

/**
 * PUT /api/profile/enableTotp
 * @tags Profile
 * @summary Updates a user's TOTP enabled flag
 * @security BearerAuth
 * @param {object} request.body.required - TOTP data
 * @example request - Enable TOTP Payload
 * {
 *   "enableTotp": true
 * }
 * @return 200 - Success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put(
  '/enabletotp',
  [check('totpEnabled', 'enableTotp is required.').not().isEmpty().trim()],
  ProfileController.enableTotp,
);

module.exports = router;
