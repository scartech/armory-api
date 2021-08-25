const express = require('express');
const { check } = require('express-validator');
const UsersController = require('../../controllers/users.controller');

const router = express.Router();

router.get('/:id', UsersController.read);
router.delete('/:id', UsersController.delete);
router.put('/:id', UsersController.update);

router.put(
  '/:id/password',
  [check('password', 'Password is required.').not().isEmpty().trim()],
  UsersController.updatePassword,
);

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
