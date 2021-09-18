const { Op } = require('sequelize');
const { History } = require('../models');

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
        attributes: {
          include: ['gunId'],
        },
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Creates a new history entry for a gun.
   *
   * @param {integer} gunId
   * @param {object} values
   * @returns
   */
  static async create(gunId, values) {
    try {
      const { name, type, narrative, eventDate, roundCount } = values;

      return await History.create({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
        gunId: gunId,
      });
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

      const { name, type, narrative, eventDate, roundCount } = values;

      return await history.update({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reads all history entries for a gun.
   *
   * @param {*} gunId
   * @returns
   */
  static async all(gunId) {
    try {
      return await History.findAll({
        where: {
          gunId: {
            [Op.eq]: gunId,
          },
        },
        order: [['eventDate', 'DESC']],
        attributes: {
          include: ['gunId'],
        },
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
