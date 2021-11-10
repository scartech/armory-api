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
      return await AmmoInventory.findByPk(id, {
        include: ['ammo', 'history'],
      });
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
        include: ['ammo', 'history'],
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
        include: ['ammo', 'history'],
        order: [['caliber', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all inventory items for a caliber for a single user from the DB.
   *
   * @param {*} userId
   * @returns
   */
  static async allForCaliber(userId, caliber) {
    try {
      return await AmmoInventory.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
          caliber: {
            [Op.eq]: caliber,
          },
        },
        include: ['ammo', 'history'],
        order: [['brand', 'ASC']],
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

      await inventory.update({
        goal,
      });

      return AmmoInventoryService.read(id);
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

      await inventory.update({
        caliber,
        brand,
        name,
        goal,
      });

      return AmmoInventoryService.read(id);
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
      const inventory = await AmmoInventoryService.read(id);
      if (!inventory) {
        throw new Error('Inventory not found.');
      }

      if (
        inventory.count > 0 ||
        inventory.totalShot > 0 ||
        inventory.totalPurchased > 0
      ) {
        throw new Error(
          'Unable to delete inventory that still exists or has been used in the past.',
        );
      }

      return await inventory.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AmmoInventoryService;
