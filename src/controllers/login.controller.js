const passport = require('passport');
const jwt = require('jsonwebtoken');
const { logger } = require('../config');

const { validationResult } = require('express-validator');

const { JWT_SECRET } = require('../config/');
const { ClientMessage } = require('../utils');

class LoginController {
  static async login(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let messages = [];
      errors.errors.map((error) => {
        messages.push(error.msg);
      });
      return res.status(400).json(new ClientMessage(true, messages));
    }

    try {
      passport.authenticate('login', async (error, user, info) => {
        if (error) {
          return res.status(500).json(new ClientMessage(true, [error.message]));
        }

        if (!user) {
          return res.status(401).send();
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };

          logger.info(`${user.email} successfully logged in.`);

          const token = jwt.sign({ user: body }, JWT_SECRET, {
            expiresIn: '2h',
          });
          return res.json({ token });
        });
      })(req, res, next);
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = LoginController;
