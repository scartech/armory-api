const generator = require('generate-password');
const notp = require('notp');
const { User, AuthToken } = require('../models');

/**
 * Service class for user profile self-service ops.
 */
class ProfileService {
  /**
   * Creates a new TOTP key value for the user.
   *
   * @param {*} id
   * @returns
   */
  static async refreshTotp(id) {
    try {
      const user = await ProfileService.read(id);
      if (!user) {
        throw new Error('User does not exist.');
      }

      user.totpKey = generator.generate({
        length: 32,
      });
      user.totpValidated = false;

      // Invalidate any Remember Me TOTP sessions
      await AuthToken.destroy({
        where: {
          userId: user.id,
        },
      });

      return await user.save({ fields: ['totpKey', 'totpValidated'] });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new TOTP key value for the user.
   *
   * @param {*} id
   * @param (*) code
   * @returns
   */
  static async validateTotp(id, code) {
    try {
      const user = await ProfileService.read(id);
      if (!user) {
        throw new Error('User does not exist.');
      }

      if (!notp.totp.verify(code, user.totpKey)) {
        throw new Error('Invalid code');
      }

      user.totpValidated = true;

      return await user.save({ fields: ['totpValidated'] });
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
      return await User.findByPk(id, {
        attributes: [
          'name',
          'email',
          'totpEnabled',
          'totpValidated',
          'totpUrl',
          'id',
          'totpKey',
        ],
        include: ['guns'],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the TOTP enabled status for a given user.
   *
   * @param {integer} id
   * @param {boolean} enabled
   * @returns
   */
  static async enableTotp(id, enabled) {
    try {
      const user = await ProfileService.read(id);
      if (!user) {
        throw new Error('User does not exist.');
      }
      user.totpEnabled = enabled;

      return await user.save({ fields: ['totpEnabled'] });
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

      return await user.save({
        fields: ['email', 'name'],
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProfileService;
