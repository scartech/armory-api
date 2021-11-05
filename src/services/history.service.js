const { Op } = require('sequelize');
const GunService = require('./gun.service');
const AmmoInventoryService = require('./ammoinventory.service');
const { History, User, Gun, AmmoInventory } = require('../models');

/**
 * Service class for Gun History CRUD ops.
 */
class HistoryService {
  /**
   * Reads a single history event from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await History.findByPk(id, {
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            model: AmmoInventory,
            as: 'inventory',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new history entry.
   *
   * @param {object} values
   * @returns
   */
  static async create(values) {
    try {
      const {
        name,
        type,
        narrative,
        eventDate,
        roundCount,
        gunIds,
        inventoryIds,
      } = values;

      const history = await History.create({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });

      if (!history) {
        throw new Error('Unable to create history');
      }

      for (let i = 0; i < gunIds.length; i++) {
        const gun = await GunService.read(gunIds[i]);
        if (gun) {
          await history.addGun(gunIds[i]);
        }
      }

      for (let i = 0; i < inventoryIds.length; i++) {
        const inventory = await AmmoInventoryService.read(inventoryIds[i]);
        if (inventory) {
          await history.addInventory(inventoryIds[i]);
        }
      }

      return await HistoryService.read(history.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing history item.
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(id, values) {
    try {
      const history = await HistoryService.read(id);
      if (!history) {
        throw new Error('History not found.');
      }

      const existingGunIds = history.guns.map((x) => x.id);
      const existingInventoryIds = history.inventory.map((x) => x.id);

      const {
        name,
        type,
        narrative,
        eventDate,
        roundCount,
        gunIds,
        inventoryIds,
      } = values;

      const updated = await history.update({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });

      const gunIdsToRemove = existingGunIds.filter((x) => !gunIds.includes(x));
      const inventoryIdsToRemove = existingInventoryIds.filter(
        (x) => !inventoryIds.includes(x),
      );

      if (!updated) {
        throw new Error('Unable to update history');
      }

      for (let i = 0; i < inventoryIds.length; i++) {
        const inventory = await AmmoInventoryService.read(inventoryIds[i]);
        if (inventory) {
          await updated.addInventory(inventoryIds[i]);
        }
      }

      for (let i = 0; i < gunIds.length; i++) {
        const gun = await GunService.read(gunIds[i]);
        if (gun) {
          await updated.addGun(gunIds[i]);
        }
      }

      for (let i = 0; i < gunIdsToRemove.length; i++) {
        await updated.removeGun(gunIdsToRemove[i]);
      }

      for (let i = 0; i < inventoryIdsToRemove.length; i++) {
        await updated.removeInventory(inventoryIdsToRemove[i]);
      }

      return await HistoryService.read(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all history entries for a gun.
   *
   * @param {*} id
   * @returns
   */
  static async gun(id) {
    try {
      return await History.findAll({
        through: {
          where: {
            gunId: {
              [Op.eq]: id,
            },
          },
        },
        order: [['eventDate', 'DESC']],
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            model: AmmoInventory,
            as: 'inventory',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all history entries for a ammo inventory type.
   *
   * @param {*} id
   * @returns
   */
  static async inventory(id) {
    try {
      return await History.findAll({
        through: {
          where: {
            ammoInventoryId: {
              [Op.eq]: id,
            },
          },
        },
        order: [['eventDate', 'DESC']],
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            model: AmmoInventory,
            as: 'inventory',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a history entry in the DB
   *
   * @param {integer} id
   * @returns
   */
  static async delete(id) {
    try {
      const history = await History.findByPk(id);
      if (!history) {
        throw new Error('History not found.');
      }

      return await history.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = HistoryService;
