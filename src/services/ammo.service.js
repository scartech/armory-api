const { Op } = require('sequelize');
const { Ammo } = require('../models');
const AmmoInventoryService = require('./ammoinventory.service');

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

      const exists = await AmmoInventoryService.exists(
        caliber,
        brand,
        name,
        userId,
      );

      let inventory;
      if (!exists) {
        inventory = await AmmoInventoryService.create(userId, {
          name,
          brand,
          caliber,
        });

        if (!inventory) {
          throw Error('Unable to create inventory item');
        }
      } else {
        inventory = await AmmoInventoryService.existing(
          caliber,
          brand,
          name,
          userId,
        );

        if (!inventory) {
          throw Error('Unable to get inventory item');
        }
      }

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
        inventoryId: inventory.id,
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

      const exists = await AmmoInventoryService.exists(
        caliber,
        brand,
        name,
        ammo.userId,
      );

      let inventory;
      if (!exists) {
        inventory = await AmmoInventoryService.create(ammo.userId, {
          name,
          brand,
          caliber,
        });

        if (!inventory) {
          throw new Error('Unable to create inventory item');
        }
      } else {
        inventory = await AmmoInventoryService.existing(
          caliber,
          brand,
          name,
          ammo.userId,
        );

        if (!inventory) {
          throw new Error('Unable to get inventory item');
        }
      }

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
        inventoryId: inventory.id,
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
