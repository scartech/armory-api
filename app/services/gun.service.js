const { Gun } = require('../models');

/**
 *
 */
class GunService {
  /**
   *
   * @param {*} userId
   * @param {*} values
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
   *
   * @param {*} id
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
   *
   * @param {*} id
   * @param {*} values
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
   *
   * @param {*} id
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
