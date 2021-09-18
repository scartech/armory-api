const { Op } = require('sequelize');
const { Gun } = require('../models');

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
        ffl,
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
        ffl,
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
      return await Gun.findByPk(id, { include: ['history'] });
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
      return await Gun.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['name', 'ASC']],
      });
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
        ffl,
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
        ffl,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates images for a Gun
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async updateImages(id, values) {
    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        throw new Error('Gun not found.');
      }

      const { frontImage, backImage, serialImage } = values;

      return await gun.update({
        frontImage,
        backImage,
        serialImage,
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
