const { validationResult } = require('express-validator');
const {
  HistoryService,
  GunService,
  AmmoInventoryService,
} = require('../services');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the History model.
 */
class HistoryController {
  /**
   * Gets all history entries for an ammo inventory
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async inventory(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    const inventory = await AmmoInventoryService.read(id);
    if (!inventory) {
      return res
        .status(404)
        .json(new ClientMessage(true, ['Inventory not found']));
    }

    if (inventory.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const histories = await HistoryService.inventory(id);
      if (histories) {
        res.status(200).json(histories);
      } else {
        res.status(404).json(new ClientMessage(true, ['History not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Gets all history entries for a gun
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async gun(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    const gun = await GunService.read(id);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Gun not found']));
    }

    if (gun.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const histories = await HistoryService.gun(id);
      if (histories) {
        res.status(200).json(histories);
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
    const {
      name,
      type,
      narrative,
      roundCount,
      eventDate,
      gunIds,
      inventoryIds,
    } = req.body;

    try {
      const history = await HistoryService.create({
        name,
        type,
        narrative,
        eventDate,
        roundCount,
        gunIds,
        inventoryIds,
      });

      if (history) {
        res.status(201).json(history);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      console.log(error);
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
    const { id } = req.params;
    const {
      name,
      type,
      narrative,
      roundCount,
      eventDate,
      gunIds,
      inventoryIds,
    } = req.body;

    const history = await HistoryService.read(id);
    if (!history) {
      return res
        .status(404)
        .json(new ClientMessage(true, ['History not found']));
    }

    if (history.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const updatedHistory = await HistoryService.update(id, {
        name,
        type,
        narrative,
        eventDate,
        roundCount,
        gunIds,
        inventoryIds,
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
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const history = await HistoryService.read(id);
      if (history) {
        if (history.userId !== userId) {
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
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const history = await HistoryService.read(id);
      if (!history) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (history.userId !== userId) {
        return res.status(401).send();
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
