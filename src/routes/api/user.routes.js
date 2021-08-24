const express = require('express');
const { check } = require('express-validator');
const UserController = require('../../controllers/user.controller');

const router = express.Router();

// Get single user
router.get('/:id', UserController.user);

// Delete a user
router.delete('/:id', UserController.delete);

// Update a user password
router.put(
  '/:id/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  UserController.updatePassword,
);

// Update a user
router.put('/:id', UserController.update);

// Create new user
router.post(
  '/',
  [
    check('email', 'Invalid email address.').isEmail().trim(),
    check('name', 'Name is required.').not().isEmpty().trim(),
    check('password', 'Password is required.').not().isEmpty().trim(),
  ],
  UserController.create,
);

// All users
router.get('/', UserController.users);

module.exports = router;
