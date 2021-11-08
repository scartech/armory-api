const { Op } = require('sequelize');
const GunService = require('./gun.service');
const AmmoInventoryService = require('./ammoinventory.service');
const { History, Gun, AmmoInventory } = require('../models');

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
            as: 'inventories',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  static async rangeDays(userId) {
    try {
      return await History.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
          type: {
            [Op.eq]: 'Range Day',
          },
        },
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            model: AmmoInventory,
            as: 'inventories',
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
  static async create(userId, values) {
    try {
      const {
        type,
        notes,
        eventDate,
        gunIds,
        inventoryIds,
        location,
        gunRoundsFired,
        inventoryRoundsFired,
      } = values;

      const history = await History.create({
        type,
        notes,
        eventDate,
        location,
        userId,
      });

      if (!history) {
        throw new Error('Unable to create history');
      }

      if (gunIds) {
        for (let i = 0; i < gunIds.length; i++) {
          const gun = await GunService.read(gunIds[i]);
          if (gun) {
            if (gun.userId !== userId) {
              throw new Error('Invalid gun');
            }

            if (gunRoundsFired && gun.id in gunRoundsFired) {
              await history.addGun(gun, {
                through: {
                  roundCount: gunRoundsFired[gun.id],
                },
              });
            } else {
              await history.addGun(gun);
            }
          }
        }
      }

      if (inventoryIds) {
        for (let i = 0; i < inventoryIds.length; i++) {
          const inventory = await AmmoInventoryService.read(inventoryIds[i]);
          if (inventory) {
            if (inventory.userId !== userId) {
              throw new Error('Invalid inventory');
            }

            if (inventoryRoundsFired && inventory.id in inventoryRoundsFired) {
              await history.addInventory(inventory, {
                through: {
                  roundCount: inventoryRoundsFired[inventory.id],
                },
              });
            } else {
              await history.addInventory(inventory);
            }
          }
        }
      }

      return await HistoryService.read(history.id);
    } catch (error) {
      throw error;
    }
  }

  static getMethods(obj) {
    var result = [];
    for (var id in obj) {
      try {
        if (typeof obj[id] == 'function') {
          result.push(id + ': ' + obj[id].toString());
        }
      } catch (err) {
        result.push(id + ': inaccessible');
      }
    }
    return result;
  }

  /**
   * Update an existing history item.
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(userId, id, values) {
    try {
      let history = await HistoryService.read(id);
      if (!history) {
        throw new Error('History not found.');
      }

      if (history.userId !== userId) {
        throw new Error('Access denied');
      }

      const {
        type,
        notes,
        eventDate,
        location,
        gunIds,
        inventoryIds,
        gunRoundsFired,
        inventoryRoundsFired,
      } = values;

      const updated = await history.update({
        type,
        notes,
        eventDate,
        location,
      });

      if (!updated) {
        throw new Error('Unable to update history');
      }

      history = await HistoryService.read(id);
      let invIds = history.inventories.map((x) => x.id);
      let gIds = history.guns.map((x) => x.id);

      for (let i = 0; i < invIds.length; i++) {
        const inv = await AmmoInventoryService.read(invIds[i]);
        const removed = await history.removeInventory(inv);

        if (removed === 0) {
          throw new Error('Failed to remove old AmmoInventory history item.');
        }
      }

      for (let i = 0; i < gIds.length; i++) {
        const gun = await GunService.read(gIds[i]);
        const removed = await history.removeGun(gun);

        if (removed === 0) {
          throw new Error('Failed to remove old Gun history item.');
        }
      }

      for (let i = 0; i < inventoryIds.length; i++) {
        const inventory = await AmmoInventoryService.read(inventoryIds[i]);
        if (inventory) {
          if (inventory.userId !== userId) {
            throw new Error('Invalid inventory');
          }

          if (inventoryRoundsFired && inventory.id in inventoryRoundsFired) {
            await history.addInventories(inventory, {
              through: {
                roundCount: inventoryRoundsFired[inventory.id],
              },
            });
          } else {
            await history.addInventories(inventoryIds[i]);
          }
        }
      }

      for (let i = 0; i < gunIds.length; i++) {
        const gun = await GunService.read(gunIds[i]);
        if (gun) {
          if (gun.userId !== userId) {
            throw new Error('Invalid gun');
          }

          if (gunRoundsFired && gun.id in gunRoundsFired) {
            await history.addGun(gun, {
              through: {
                roundCount: gunRoundsFired[gun.id],
              },
            });
          } else {
            await history.addGun(gun);
          }
        }
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
        order: [['eventDate', 'DESC']],
        include: [
          {
            required: true,
            model: Gun,
            as: 'guns',
            through: {
              where: {
                gun_id: {
                  [Op.eq]: id,
                },
              },
            },
          },
          {
            model: AmmoInventory,
            as: 'inventories',
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
        order: [['eventDate', 'DESC']],
        include: [
          {
            model: Gun,
            as: 'guns',
          },
          {
            required: true,
            model: AmmoInventory,
            as: 'inventories',
            through: {
              where: {
                ammo_inventory_id: {
                  [Op.eq]: id,
                },
              },
            },
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
