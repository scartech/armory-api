const { Op } = require('sequelize');
const GunService = require('./gun.service');
const { Gun, Accessory } = require('../models');

/**
 * Service class for Gun Accessory CRUD ops.
 */
class AccessoryService {
  /**
   * Reads a single accessory from the DB
   *
   * @param {integer} id
   * @returns
   */
  static async read(id) {
    try {
      return await Accessory.findByPk(id, {
        include: [
          {
            model: Gun,
            as: 'guns',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all accessory entries for a user.
   *
   * @param {*} id
   * @returns
   */
  static async all(userId) {
    try {
      return await Accessory.findAll({
        where: {
          userId: {
            [Op.eq]: userId,
          },
        },
        order: [['type', 'DESC']],
        include: [
          {
            model: Gun,
            as: 'guns',
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new accessory entry.
   *
   * @param {object} values
   * @returns
   */
  static async create(userId, values) {
    try {
      const {
        type,
        serialNumber,
        modelName,
        manufacturer,
        count,
        notes,
        country,
        storageLocation,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        manufactureYear,
        gunIds,
      } = values;

      const accessory = await Accessory.create({
        type,
        serialNumber,
        modelName,
        manufacturer,
        count,
        notes,
        country,
        storageLocation,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        manufactureYear,
        userId,
      });

      if (!accessory) {
        throw new Error('Unable to create accessory');
      }

      if (gunIds) {
        for (let i = 0; i < gunIds.length; i++) {
          const gun = await GunService.read(gunIds[i]);
          if (gun) {
            if (gun.userId !== userId) {
              throw new Error('Invalid gun');
            }

            await accessory.addGun(gun);
          }
        }
      }

      return await AccessoryService.read(accessory.id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an existing accessory item.
   *
   * @param {integer} id
   * @param {object} values
   * @returns
   */
  static async update(userId, id, values) {
    try {
      let accessory = await AccessoryService.read(id);
      if (!accessory) {
        throw new Error('Accessory not found.');
      }

      if (accessory.userId !== userId) {
        throw new Error('Access denied');
      }

      const {
        type,
        serialNumber,
        modelName,
        manufacturer,
        count,
        notes,
        country,
        storageLocation,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        manufactureYear,
        gunIds,
      } = values;

      const updated = await accessory.update({
        type,
        serialNumber,
        modelName,
        manufacturer,
        count,
        notes,
        country,
        storageLocation,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        manufactureYear,
      });

      if (!updated) {
        throw new Error('Unable to update accessory');
      }

      accessory = await AccessoryService.read(id);
      let gIds = accessory.guns.map((x) => x.id);

      for (let i = 0; i < gIds.length; i++) {
        const gun = await GunService.read(gIds[i]);
        const removed = await accessory.removeGun(gun);

        if (removed === 0) {
          throw new Error('Failed to remove old Gun accessory item.');
        }
      }

      for (let i = 0; i < gunIds.length; i++) {
        const gun = await GunService.read(gunIds[i]);
        if (gun) {
          if (gun.userId !== userId) {
            throw new Error('Invalid gun');
          }

          await accessory.addGun(gun);
        }
      }

      return await AccessoryService.read(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all accessory entries for a gun.
   *
   * @param {*} id
   * @returns
   */
  static async gun(id) {
    try {
      return await Accessory.findAll({
        order: [['type', 'DESC']],
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
        ],
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes an accessory entry in the DB
   *
   * @param {integer} id
   * @returns
   */
  static async delete(id) {
    try {
      const accessory = await Accessory.findByPk(id);
      if (!accessory) {
        throw new Error('Accessory not found.');
      }

      return await accessory.destroy();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AccessoryService;
