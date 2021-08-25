const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const JWT_SECRET = require('../config/jwt.config').JWT_SECRET;

class LoginController {
  static async login(req, res, next) {
    try {
      passport.authenticate('login', async (err, user, info) => {
        if (err || !user) {
          const error = new Error('An error occurred.');
          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = {
            id: user.id,
            email: user.email,
          };

          console.log(`${user.email} successfully logged in.`);

          const token = jwt.sign({ user: body }, JWT_SECRET);
          return res.json({ token });
        });
      })(req, res, next);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = LoginController;
