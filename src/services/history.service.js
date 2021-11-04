const { Op } = require('sequelize');
const GunService = require('./gun.service');
const { History, User, Gun } = require('../models');

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
      const { name, type, narrative, eventDate, roundCount, gunIds } = values;

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
      const history = await History.findByPk(id);
      if (!history) {
        throw new Error('History not found.');
      }

      const { name, type, narrative, eventDate, roundCount, gunIds } = values;

      const updated = await history.update({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });

      if (!updated) {
        throw new Error('Unable to update history');
      }

      for (let i = 0; i < gunIds.length; i++) {
        const gun = await GunService.read(gunIds[i]);
        if (gun) {
          await updated.addGun(gunIds[i]);
        }
      }

      return await HistoryService.read(updated.id);
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
