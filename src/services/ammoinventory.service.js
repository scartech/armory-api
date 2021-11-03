const { Op } = require('sequelize');
const { AmmoInventory, Ammo } = require('../models');

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
   * Checks if an ammo inventory item exists.
   *
   * @param {*} caliber
   * @param {*} brand
   * @param {*} name
   * @param {*} userId
   */
  static async exists(caliber, brand, name, userId) {
    try {
      const count = await AmmoInventory.count({
        where: {
          caliber: {
            [Op.eq]: caliber,
          },
          brand: {
            [Op.eq]: brand,
          },
          name: {
            [Op.eq]: name,
          },
          user_id: {
            [Op.eq]: userId,
          },
        },
      });

      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Gets an inventory item that matches the parameters
   *
   * @param {*} caliber
   * @param {*} brand
   * @param {*} name
   * @param {*} userId
   */
  static async existing(caliber, brand, name, userId) {
    try {
      return await AmmoInventory.findOne({
        where: {
          caliber: {
            [Op.eq]: caliber,
          },
          brand: {
            [Op.eq]: brand,
          },
          name: {
            [Op.eq]: name,
          },
          user_id: {
            [Op.eq]: userId,
          },
        },
      });
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
        include: 'ammo',
        order: [['caliber', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Updates the goal for a single inventory item
   *
   * @param {integer} id
   * @param {object} goal
   * @returns
   */
  static async updateGoal(id, goal) {
    try {
      const inventory = await AmmoInventory.findByPk(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      const goalNum = parseInt(goal);
      if (isNaN(goalNum)) {
        throw new Error('Invalid goal value.');
      }

      return await inventory.update({
        goal,
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
