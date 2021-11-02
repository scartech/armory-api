const { Op } = require('sequelize');
const { AmmoInventory } = require('../models');

/**
 * Service class for Inventory CRUD ops.
 */
class AmmoInventoryService {
  /**
   * Creates new inventory item for a given user.
   *
   * @param {integer} userId
   * @param {object} values
   * @returns
   */
  static async create(userId, values) {
    try {
      const { caliber, brand, name, goal } = values;

      return await AmmoInventory.create({
        caliber,
        brand,
        name,
        goal,
        userId: userId,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads a single inventory item from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await AmmoInventory.findByPk(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all inventory items for a single user from the DB.
   *
   * @param {*} userId
   * @returns
   */
  static async all(userId) {
    try {
      return await AmmoInventory.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['caliber', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates a single inventory item
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(id, values) {
    try {
      const inventory = await AmmoInventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      const { caliber, brand, name, goal } = values;

      return await inventory.update({
        caliber,
        brand,
        name,
        goal,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an inventory item in the DB
   *
   * @param {integer} id
   * @returns
   */
  static async delete(id) {
    try {
      const inventory = await AmmoInventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      return await inventory.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AmmoInventoryService;
