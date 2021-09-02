const { User } = require('../models');

/**
 * Service class for User CRUD ops
 */
class UserService {
  /**
   * Checks if a user exists with a given email address.
   *
   * @param {string} email
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
   * Creates a new user.
   *
   * @param {object} values
   * @returns
   */
  static async create(values) {
    try {
      const { email, name, password, role, enabled } = values;
      const exists = UserService.exists(email);

      if (exists > 0) {
        throw new Error('A user already exists with this email address.');
      }

      const hashedPassword = await User.hashPassword(password);
      return await User.create({
        email,
        name,
        password: hashedPassword,
        role,
        enabled,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single user from the DB.
   *
   * @param {integer} id
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
   * Deletes a user from the DB.
   *
   * @param {integer} id
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
   * Updates the password for a given user.
   *
   * @param {integer} id
   * @param {string} password
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
      const { email, name, role, enabled } = values;
      const user = await UserService.read(id);

      if (!user) {
        throw new Error('User not found.');
      }

      user.email = email;
      user.name = name;
      user.role = role;
      user.enabled = enabled;

      return await user.save({ fields: ['email', 'name', 'role', 'enabled'] });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all users from the DB.
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
