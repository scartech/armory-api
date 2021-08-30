const express = require('express');
const { check, validationResult } = require('express-validator');
const ClientMessage = require('../../util/ClientMessage');
const UsersController = require('../../controllers/users.controller');

const router = express.Router();

/**
 * GET /api/users/{id}
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
 *   "admin": false,
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
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await UsersController.read(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json(new ClientMessage(true, ['Not found']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

/**
 * DELETE /api/users/{id}
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
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    const success = await UsersController.delete(id);
    if (success) {
      res.status(200).send();
    } else {
      res.status(500).json(new ClientMessage(true, ['Delete failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

/**
 * PUT /api/users/{id}
 * @tags Users
 * @summary Creates a new user
 * @security BearerAuth
 * @param {integer} id.path - User ID
 * @param {object} request.body.required - User data
 * @example request - Existing User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "admin": false,
 *   "enabled": true
 * }
 * @return {object} 200 - Updated an existing user
 * @example response - 200 - Updated User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "admin": false,
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
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    const { email, name, admin, enabled } = req.body;

    const updatedUser = await UsersController.update(id, {
      email,
      name,
      admin,
      enabled,
    });

    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(500).json(new ClientMessage(true, ['Update failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

/**
 * PUT /api/users/{id}/password
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
  async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = [];
        errors.errors.map((error) => {
          messages.push(error.msg);
        });
        return res.status(400).json(new ClientMessage(true, messages));
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const success = await UsersController.updatePassword(id, password);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  },
);

/**
 * POST /api/users
 * @tags Users
 * @summary Creates a new user
 * @security BearerAuth
 * @param {object} request.body.required - User info
 * @example request - Valid New User
 * {
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "admin": false,
 *   "enabled": true,
 *   "password": "secretpassword"
 * }
 * @return {object} 201 - Create a new user
 * @example response - 201 - Created User
 * {
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "admin": false,
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
  async (req, res) => {
    const { name, email, password, admin, enabled } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = [];
        errors.errors.map((error) => {
          messages.push(error.msg);
        });
        return res.status(400).json(new ClientMessage(true, messages));
      }

      const exists = await UsersController.exists(email);
      if (exists) {
        return res
          .status(409)
          .json(
            new ClientMessage(true, [
              'A user already exists with this email address.',
            ]),
          );
      }

      const user = await UsersController.create({
        name,
        email,
        password,
        admin,
        enabled,
      });

      if (user) {
        res.status(201).json(user);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  },
);

/**
 * GET /api/users
 * @tags Users
 * @summary Gets all users
 * @security BearerAuth
 * @return {array<object>} 200 - Array of users
 * @example response - 200 - Users
 * [{
 *   "id": 3,
 *   "email": "test@noreply.com",
 *   "name": "John Doe",
 *   "admin": false,
 *   "enabled": true,
 *   "updatedAt": "2021-08-29T22:29:46.740Z",
 *   "createdAt": "2021-08-29T22:29:46.740Z",
 *   "guns": []
 * }]
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 500 - A server error occurred
 */
router.get('/', async (req, res) => {
  try {
    const users = await UsersController.users();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

module.exports = router;
