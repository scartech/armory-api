const User = require('../models/User');
const { validationResult } = require('express-validator');

class UsersController {
  static async exists(email) {
    try {
      const count = await User.count({
        where: {
          email,
        },
      });

      return count > 0;
    } catch (error) {
      return next(error);
    }
  }

  static async create(values) {
    try {
      const { email, name, password, admin, enabled } = values;
      const exists = UsersController.exists(email);

      if (exists > 0) {
        throw new Error('A user already exists with this email address.');
      }

      const hashedPassword = await User.hashPassword(password);
      return await User.create({
        email,
        name,
        password: hashedPassword,
        admin,
        enabled,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async read(id) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      return await User.destroy({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(id, password) {
    try {
      const user = await User.findByPk(parseInt(id));
      if (!user) {
        throw new Error('User does not exist.');
      }

      const hashedPassword = await User.hashPassword(password);
      user.password = hashedPassword;

      return await user.save({ fields: ['password'] });
    } catch (error) {
      return next(error);
    }
  }

  static async update(id, values) {
    try {
      const { email, name, admin, enabled } = values;
      const user = await UsersController.read(id);

      if (!user) {
        throw new Error('User not found.');
      }

      user.email = email;
      user.name = name;
      user.admin = admin;
      user.enabled = enabled;

      return await user.save({ fields: ['email', 'name', 'admin', 'enabled'] });
    } catch (error) {
      throw error;
    }
  }

  static async users(req, res, next) {
    try {
      User.findAll({
        include: ['guns'],
      })
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = UsersController;
