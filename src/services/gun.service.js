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
      return await Gun.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single image from the DB (front, back, serial)
   *
   * @param {integer} id
   * @param {string} type
   */
  static async readImage(id, type) {
    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        return;
      }

      switch (type) {
        case 'front':
          return gun.frontImage;
        case 'back':
          return gun.backImage;
        case 'serial':
          return gun.serialImage;
        default:
          return;
      }
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

      return user.guns.sort((a, b) => a.name.localeCompare(b.name));
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
