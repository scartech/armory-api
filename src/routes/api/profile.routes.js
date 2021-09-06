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
 *   "name": "John Doe"
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', ProfileController.read);

/**
 * PUT /api/profile
 * @tags Profile
 * @summary Updates an existing user
 * @security BearerAuth
 * @param {object} request.body.required - User data
 * @example request - Existing User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe"
 * }
 * @return {object} 200 - Updated an existing user
 * @example response - 200 - Updated User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe"
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

module.exports = router;
