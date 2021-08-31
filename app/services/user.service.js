const { User } = require('../models');

/**
 *
 */
class UserService {
  /**
   *
   * @param {*} email
   * @returns
   */
  static async exists(email) {
    try {
      const count = await User.count({
        where: {
          email,
        },
      });

      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} values
   * @returns
   */
  static async create(values) {
    try {
      const { email, name, password, admin, enabled } = values;
      const exists = UserService.exists(email);

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
      throw error;
    }
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  static async read(id) {
    try {
      return await User.findByPk(id, { include: ['guns'] });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} id
   * @returns
   */
  static async delete(id) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error('User not found.');
      }

      return await user.destroy();
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} id
   * @param {*} password
   * @returns
   */
  static async updatePassword(id, password) {
    try {
      const user = await UserService.read(id);
      if (!user) {
        throw new Error('User does not exist.');
      }

      const hashedPassword = await User.hashPassword(password);
      user.password = hashedPassword;

      return await user.save({ fields: ['password'] });
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param {*} id
   * @param {*} values
   * @returns
   */
  static async update(id, values) {
    try {
      const { email, name, admin, enabled } = values;
      const user = await UserService.read(id);

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

  /**
   *
   * @returns
   */
  static async users() {
    try {
      return await User.findAll({
        include: ['guns'],
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
