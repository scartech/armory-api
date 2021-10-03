const { Op } = require('sequelize');
const { Ammo } = require('../models');

/**
 * Service class for Ammo CRUD ops.
 */
class AmmoService {
  /**
   * Creates new ammo for a given user.
   *
   * @param {integer} userId
   * @param {object} values
   * @returns
   */
  static async create(userId, values) {
    try {
      const {
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      } = values;

      return await Ammo.create({
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single Ammo from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await Ammo.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all ammo for a single user from the DB.
   *
   * @param {*} userId
   * @returns
   */
  static async ammo(userId) {
    try {
      return await Ammo.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['purchaseDate', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates Ammo
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(id, values) {
    try {
      const ammo = await Ammo.findByPk(id);
      if (!ammo) {
        throw new Error('Ammo not found.');
      }

      const {
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      } = values;

      return await ammo.update({
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes Ammo in the DB
   *
   * @param {integer} id
   * @returns
   */
  static async delete(id) {
    try {
      const ammo = await Ammo.findByPk(id);
      if (!ammo) {
        throw new Error('Ammo not found.');
      }

      return await ammo.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AmmoService;
