const express = require('express');
const { check } = require('express-validator');
const { UserController } = require('../../controllers');

const router = express.Router();

/**
 * GET /admin/users/{id}
 * @tags Users
 * @summary Gets a single user by ID
 * @security BearerAuth
 * @param {integer} id.path - User ID
 * @return {array<object>} 200 - success
 * @example response - 200 - User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true,
 *   "updatedAt": "2021-08-29T22:29:46.740Z",
 *   "createdAt": "2021-08-29T22:29:46.740Z",
 *   "guns": []
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/:id', UserController.read);

/**
 * DELETE /admin/users/{id}
 * @tags Users
 * @summary Deletes a user by ID
 * @security BearerAuth
 * @param {integer} id.path - User ID
 * @return 200 - Success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.delete('/:id', UserController.delete);

/**
 * PUT /admin/users/{id}
 * @tags Users
 * @summary Creates a new user
 * @security BearerAuth
 * @param {integer} id.path - User ID
 * @param {object} request.body.required - User data
 * @example request - Existing User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true
 * }
 * @return {object} 200 - Updated an existing user
 * @example response - 200 - Updated User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true,
 *   "updatedAt": "2021-08-29T22:29:46.740Z",
 *   "createdAt": "2021-08-29T22:29:46.740Z",
 *   "guns": []
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 400 - Missing or invalid parameters
 * @return {ClientMessage} 404 - The user was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
router.put('/:id', UserController.update);

/**
 * PUT /admin/users/{id}/password
 * @tags Users
 * @summary Updates a user's password
 * @security BearerAuth
 * @param {integer} id.path - User ID
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
  '/:id/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  UserController.updatePassword,
);

/**
 * POST /admin/users
 * @tags Users
 * @summary Creates a new user
 * @security BearerAuth
 * @param {object} request.body.required - User info
 * @example request - Valid New User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true,
 *   "password": "secretpassword"
 * }
 * @return {object} 201 - Create a new user
 * @example response - 201 - Created User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true,
 *   "updatedAt": "2021-08-29T22:29:46.740Z",
 *   "createdAt": "2021-08-29T22:29:46.740Z",
 *   "guns": []
 * }
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Missing or invalid parameters
 * @return {ClientMessage} 409 - A user already exists with the supplied email address
 * @return {ClientMessage} 500 - A server error occurred
 */
router.post(
  '/',
  [
    check('email', 'Invalid email address.').isEmail().trim(),
    check('name', 'Name is required.').not().isEmpty().trim(),
    check('password', 'Password is required.').not().isEmpty().trim(),
  ],
  UserController.create,
);

/**
 * GET /admin/users
 * @tags Users
 * @summary Gets all users
 * @security BearerAuth
 * @return {array<object>} 200 - Array of users
 * @example response - 200 - Users
 * [{
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "role": "USER",
 *   "enabled": true,
 *   "updatedAt": "2021-08-29T22:29:46.740Z",
 *   "createdAt": "2021-08-29T22:29:46.740Z",
 *   "guns": []
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', UserController.users);

module.exports = router;
