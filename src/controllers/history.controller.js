const { validationResult } = require('express-validator');
const { HistoryService, GunService } = require('../services');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the History model.
 */
class HistoryController {
  /**
   * Gets all history entries for a gun
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async all(req, res) {
    const { gunId } = req.params;
    const userId = req.user.id;

    if (isNaN(gunId)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    const gun = await GunService.read(gunId);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Gun not found']));
    }

    if (gun.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const history = await HistoryService.all(gunId);
      if (history) {
        res.status(200).json(history);
      } else {
        res.status(404).json(new ClientMessage(true, ['History not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Creates a new history item.
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const userId = req.user.id;
    const { gunId } = req.params;
    const { name, type, narrative, roundCount, eventDate } = req.body;

    const gun = await GunService.read(gunId);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    if (gun.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const history = await HistoryService.create(gunId, {
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });

      if (history) {
        res.status(201).json(history);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates an existing history item.
   *
   * @param {*} req
   * @param {*} res
   */
  static async update(req, res) {
    const userId = req.user.id;
    const { gunId, id } = req.params;
    const { name, type, narrative, roundCount, eventDate } = req.body;

    const gun = await GunService.read(gunId);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Gun not found']));
    }

    if (gun.userId !== userId) {
      return res.status(401).send();
    }

    const history = await HistoryService.read(id);
    if (!history) {
      return res
        .status(404)
        .json(new ClientMessage(true, ['History not found']));
    }

    try {
      const updatedHistory = await HistoryService.update(id, {
        name,
        type,
        narrative,
        eventDate,
        roundCount,
      });

      if (updatedHistory) {
        res.status(200).json(updatedHistory);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads a history item by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async read(req, res) {
    const userId = req.user.id;
    const { gunId, id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const history = await HistoryService.read(id);
      if (history) {
        if (history.gunId !== parseInt(gunId)) {
          return res
            .status(404)
            .json(new ClientMessage(true, ['History/Gun not found']));
        }

        const gun = await GunService.read(history.gunId);
        if (!gun) {
          return res
            .status(404)
            .json(new ClientMessage(true, ['Gun not found']));
        }

        if (gun.userId !== userId) {
          return res.status(401).send();
        }

        return res.status(200).json(history);
      } else {
        return res
          .status(404)
          .json(new ClientMessage(true, ['History not found']));
      }
    } catch (error) {
      return res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Deletes a History item by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async delete(req, res) {
    const userId = req.user.id;
    const { gunId, id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    const gun = await GunService.read(gunId);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    if (gun.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const history = await HistoryService.read(id);
      if (!history) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const success = await HistoryService.delete(id);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Delete failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = HistoryController;
