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
      return await Gun.findByPk(id, {
        include: ['history'],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all images for a single Gun from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async readImages(id) {
    try {
      const gun = await Gun.scope('allImages').findByPk(id);

      if (gun == null) {
        return null;
      }

      return {
        id: gun.id,
        userId: gun.userId,
        frontImage: gun.frontImage,
        backImage: gun.backImage,
        serialImage: gun.serialImage,
        receiptImage: gun.receiptImage,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single Gun image from the DB
   *
   * @param {integer} id
   * @param {string} type image type (back, front, serial, receipt)
   * @returns
   */
  static async readForImage(id, type) {
    try {
      let scope;

      switch (type) {
        case 'front':
          scope = 'frontImage';
          break;
        case 'back':
          scope = 'backImage';
          break;
        case 'serial':
          scope = 'serialImage';
          break;
        case 'receipt':
          scope = 'receiptImage';
          break;
      }

      const gun = await Gun.scope(scope).findByPk(id);

      if (gun == null) {
        return null;
      }

      return gun;
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

      const { frontImage, backImage, serialImage, receiptImage } = values;

      return await gun.update({
        frontImage,
        backImage,
        serialImage,
        receiptImage,
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
