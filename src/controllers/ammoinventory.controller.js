const { AmmoInventoryService } = require('../services');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the Inventory model.
 */
class AmmoInventoryController {
  /**
   * Creates new inventory entry.
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const { caliber, brand, name, goal } = req.body;

    try {
      const inventory = await AmmoInventoryService.create(req.user.id, {
        brand,
        name,
        caliber,
        goal,
      });

      if (inventory) {
        res.status(201).json(inventory);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads inventory by ID.
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
      const inventory = await AmmoInventoryService.read(id);
      if (inventory) {
        if (inventory.userId !== userId) {
          return res.status(401).send();
        }

        res.status(200).json(inventory);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates inventory by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const inventory = await AmmoInventoryService.read(id);
      if (!inventory) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (inventory.userId !== userId) {
        return res.status(401).send();
      }

      const { caliber, brand, name, goal } = req.body;

      const updatedInventory = await AmmoInventoryService.update(id, {
        caliber,
        brand,
        name,
        goal,
      });

      if (updatedInventory) {
        res.status(200).json(updatedInventory);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Deletes inventory item by ID.
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
      const inventory = await AmmoInventoryService.read(id);
      if (!inventory) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (inventory.userId !== userId) {
        return res.status(401).send();
      }

      const success = await AmmoInventoryService.delete(id);
      if (success) {
        res.status(200).send();
      } else {
        res.status(500).json(new ClientMessage(true, ['Delete failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Gets all inventory for the logged in user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async all(req, res) {
    try {
      const inventory = await AmmoInventoryService.all(req.user.id);
      if (inventory) {
        res.status(200).json(inventory);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Gets all inventory of a spcecific caliber for the logged in user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async allForCaliber(req, res) {
    try {
      const userId = req.user.id;
      const { caliber } = req.params;

      const inventory = await AmmoInventoryService.allForCaliber(
        userId,
        caliber,
      );
      if (inventory) {
        res.status(200).json(inventory);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = AmmoInventoryController;
