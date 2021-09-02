const User = require('../models/User');
const { UserService } = require('../services');
const ClientMessage = require('../utils/ClientMessage');
const { validationResult } = require('express-validator');

class UserController {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async read(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const user = await UserService.read(id);
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
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async delete(req, res) {
    const { id } = req.params;

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

      const success = await UserService.delete(id);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Delete failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async update(req, res) {
    const { id } = req.params;

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

      const { email, name, role, enabled } = req.body;

      const updatedUser = await UserService.update(id, {
        email,
        name,
        role,
        enabled,
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
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async updatePassword(req, res) {
    const { id } = req.params;
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

      const success = await UserService.updatePassword(id, password);
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
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async create(req, res) {
    const { name, email, password, role, enabled } = req.body;

    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let messages = [];
        errors.errors.map((error) => {
          messages.push(error.msg);
        });
        return res.status(400).json(new ClientMessage(true, messages));
      }

      const exists = await UserService.exists(email);
      if (exists) {
        return res
          .status(409)
          .json(
            new ClientMessage(true, [
              'A user already exists with this email address.',
            ]),
          );
      }

      const user = await UserService.create({
        name,
        email,
        password,
        role,
        enabled,
      });

      if (user) {
        res.status(201).json(user);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async users(req, res) {
    try {
      const users = await UserService.users();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = UserController;
