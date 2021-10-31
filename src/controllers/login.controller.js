const passport = require('passport');
const jwt = require('jsonwebtoken');
const { logger } = require('../config');

const { validationResult } = require('express-validator');

const { JWT_SECRET } = require('../config/');
const { ClientMessage } = require('../utils');
const { User } = require('../models');

/**
 * Handles HTTP login requests.
 */
class LoginController {
  /**
   * Performs login based on an input email and password.
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns A JWT token.
   */
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
      passport.authenticate('local', async (error, user) => {
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
            totpValidated: user.totpValidated,
            totpEnabled: user.totpEnabled,
            totpLoggedIn: false,
          };

          logger.info(
            `${user.email} successfully logged in using local strategy`,
          );

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

  static async loginTotp(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      let messages = [];
      errors.errors.map((error) => {
        messages.push(error.msg);
      });
      return res.status(400).json(new ClientMessage(true, messages));
    }

    // Set the request user here instead of storing it in session. It's only needed when loggin in.
    const { userId } = req.body;
    const user = await User.findByPk(userId);
    req.user = user;

    try {
      passport.authenticate('totp', async (error, user) => {
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
            totpValidated: user.totpValidated,
            totpEnabled: user.totpEnabled,
            totpLoggedIn: true,
          };

          logger.info(`${user.email} successfully logged in using TOTP`);

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
