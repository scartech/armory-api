const User = require('../models/User');
const { ProfileService } = require('../services');
const ClientMessage = require('../utils/ClientMessage');
const { validationResult } = require('express-validator');

/**
 * Handles HTTP requests for the Users model for user profile self-service.
 */
class ProfileController {
  /**
   * Creates a new random TOTP key value for the user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async refreshTotp(req, res) {
    const { id } = req.user;

    try {
      const user = await ProfileService.refreshTotp(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Validates a TOTP code for a user.
   *
   * @param {*} req
   * @param {*} res
   */
  static async validateTotp(req, res) {
    const { id } = req.user;
    const { code } = req.body;

    try {
      const validated = await ProfileService.validateTotp(id, code);
      if (validated) {
        res.sendStatus(200);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Fetches a User for an ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async read(req, res) {
    const { id } = req.user;

    try {
      const user = await ProfileService.read(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates the user's profile.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async update(req, res) {
    const { id } = req.user;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const { email, name, totpEnabled, totpKey } = req.body;
      const updatedUser = await ProfileService.update(id, {
        email,
        name,
        totpEnabled,
        totpKey,
      });

      if (updatedUser) {
        res.status(200).json(updatedUser);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates a user TOTP enabled setting.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async enableTotp(req, res) {
    const { id } = req.user;
    const { totpEnabled } = req.body;

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

      const success = await ProfileService.enableTotp(id, totpEnabled);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates a user password.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updatePassword(req, res) {
    const { id } = req.user;
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

      const success = await ProfileService.updatePassword(id, password);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = ProfileController;
