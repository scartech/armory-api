const User = require('../models/User');
const { validationResult } = require('express-validator');

class UsersController {
  static async create(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let message = '';
        errors.errors.map((error) => {
          message += error.msg + ' ';
        });
        return res.status(400).send(message);
      }

      const { email, name, password, admin, enabled } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        return res
          .status(400)
          .send('A user already exists with this email address.');
      }

      const hashedPassword = await User.hashPassword(password);
      User.create({
        email,
        name,
        password: hashedPassword,
        admin,
        enabled,
      })
        .then((user) => {
          User.findByPk(user.id)
            .then((user) => res.status(200).json(user))
            .catch((error) => res.status(500).send(error.message));
        })
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async read(req, res, next) {
    const { id } = req.params;

    try {
      User.findByPk(id)
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).send('User does not exist.');
      }

      User.destroy({
        where: {
          id,
        },
      })
        .then(() => res.status(200).send())
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async updatePassword(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).send('User does not exist.');
      }

      const { password } = req.body;

      const hashedPassword = await User.hashPassword(password);

      User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: parseInt(id),
          },
        },
      )
        .then(() => res.status(200).send())
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(400).send('User does not exist.');
      }

      const { email, name, admin, enabled } = req.body;

      User.update(
        {
          email,
          name,
          admin,
          enabled,
        },
        {
          where: {
            id: parseInt(id),
          },
        },
      )
        .then(() => res.status(200).send())
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
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
