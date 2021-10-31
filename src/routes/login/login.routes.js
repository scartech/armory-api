const express = require('express');
const { check } = require('express-validator');
const { LoginController } = require('../../controllers');

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

// Login TOTP
router.post(
  '/totp',
  [check('code', 'Invalid verification code.').not().isEmpty().trim()],
  LoginController.loginTotp,
);

module.exports = router;
