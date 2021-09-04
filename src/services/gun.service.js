const { Gun } = require('../models');
const UserService = require('./user.service');

/**
 * Service class for Gun CRUD ops.
 */
class GunService {
  /**
   * Creates a new gun for a given user.
   *
   * @param {integer} userId
   * @param {object} values
   * @returns
   */
  static async create(userId, values) {
    try {
      const {
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      } = values;

      return await Gun.create({
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single Gun from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await Gun.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all guns for a single user from the DB.
   *
   * @param {*} userId
   * @returns
   */
  static async guns(userId) {
    try {
      const user = await UserService.read(userId);
      if (!user) {
        return;
      }

      return user.guns;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a Gun
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(id, values) {
    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        throw new Error('Gun not found.');
      }

      const {
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      } = values;

      return await gun.update({
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a Gun in the DB
   *
   * @param {integer} id
   * @returns
   */
  static async delete(id) {
    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        throw new Error('Gun not found.');
      }

      return await gun.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = GunService;
