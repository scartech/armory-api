const express = require('express');
const { check } = require('express-validator');
const LoginController = require('../../controllers/login.controller');

const router = express.Router();

// Login
router.post(
  '/',
  [
    check('email', 'Invalid email address.').isEmail().trim(),
    check('password', 'Password is required.').not().isEmpty().trim(),
  ],
  LoginController.login,
);

module.exports = router;
