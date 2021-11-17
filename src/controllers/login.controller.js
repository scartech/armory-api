const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const add = require('date-fns/add');
const isBefore = require('date-fns/isBefore');
const { logger } = require('../config');
const Crypto = require('crypto');
const { validationResult } = require('express-validator');
const { JWT_SECRET } = require('../config/');
const { ClientMessage } = require('../utils');
const { User, AuthToken } = require('../models');

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

          const { validator, selector } = req.body;

          if (validator && selector && user.totpEnabled && user.totpValidated) {
            const hashedValidator = await User.hashPassword(validator);
            const authToken = await AuthToken.findOne({
              where: {
                selector,
              },
            });

            if (authToken) {
              const hashEqual = await bcrypt.compare(
                validator,
                authToken.hashedValidator,
              );

              if (hashEqual && isBefore(new Date(), authToken.expires)) {
                const newValidator = Crypto.randomBytes(64).toString('base64');
                const newSelector = Crypto.randomBytes(12).toString('base64');
                authToken.hashedValidator = await User.hashPassword(
                  newValidator,
                );
                authToken.selector = newSelector;

                await authToken.save();

                body.selector = newSelector;
                body.validator = newValidator;
                body.totpLoggedIn = true;

                logger.info(
                  `${user.email} successfully logged into TOTP using a Remember Me token`,
                );
              }
            }
          }

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

          const rememberMe = req.body.rememberMe;
          if (rememberMe) {
            const validator = Crypto.randomBytes(64).toString('base64');
            const selector = Crypto.randomBytes(12).toString('base64');

            const authToken = AuthToken.build({
              hashedValidator: await User.hashPassword(validator),
              selector,
              userId: user.id,
              expires: add(new Date(), { days: 7 }),
            });

            body.selector = selector;
            body.validator = validator;

            await authToken.save();
          }

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
