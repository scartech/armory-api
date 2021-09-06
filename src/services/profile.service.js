const { User } = require('../models');

/**
 * Service class for user profile self-service ops.
 */
class ProfileService {
  /**
   * Reads a single user from the DB.
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await User.findByPk(id, {
        attributes: ['name', 'email', 'id'],
        include: ['guns'],
      });
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
      const user = await ProfileService.read(id);
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
      const { email, name } = values;
      const user = await ProfileService.read(id);

      if (!user) {
        throw new Error('User not found.');
      }

      user.email = email;
      user.name = name;

      return await user.save({ fields: ['email', 'name'] });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProfileService;
