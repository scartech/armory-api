const { Op } = require('sequelize');
const { Inventory } = require('../models');

/**
 * Service class for Inventory CRUD ops.
 */
class InventoryService {
  /**
   * Creates new inventory item for a given user.
   *
   * @param {integer} userId
   * @param {object} values
   * @returns
   */
  static async create(userId, values) {
    try {
      const { name, type, count, goal } = values;

      return await Inventory.create({
        name,
        type,
        count,
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
      return await Inventory.findByPk(id);
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
      return await Inventory.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['name', 'DESC']],
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
      const inventory = await Inventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      const { name, type, count, goal } = values;

      return await inventory.update({
        name,
        type,
        count,
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
      const inventory = await Inventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      return await inventory.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InventoryService;
