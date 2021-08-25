const express = require('express');
const { check } = require('express-validator');
const UsersController = require('../../controllers/users.controller');

const router = express.Router();

// Get single user
router.get('/:id', UsersController.user);

// Delete a user
router.delete('/:id', UsersController.delete);

// Update a user password
router.put(
  '/:id/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  UsersController.updatePassword,
);

// Update a user
router.put('/:id', UsersController.update);

// Create new user
router.post(
  '/',
  [
    check('email', 'Invalid email address.').isEmail().trim(),
    check('name', 'Name is required.').not().isEmpty().trim(),
    check('password', 'Password is required.').not().isEmpty().trim(),
  ],
  UsersController.create,
);

// All users
router.get('/', UsersController.users);

module.exports = router;
