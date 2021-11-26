const { validationResult } = require('express-validator');
const { GunService, AccessoryService } = require('../services');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the Accessory model.
 */
class AccessoryController {
  /**
   * Gets all accessories for a gun
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
      const accessories = await AccessoryService.gun(id);
      if (accessories) {
        res.status(200).json(accessories);
      } else {
        res
          .status(404)
          .json(new ClientMessage(true, ['Accessories not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Creates a new accessory item.
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const userId = req.user.id;
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
      pricePerItem,
      magazineCapacity,
      gunIds,
    } = req.body;

    try {
      const accessory = await AccessoryService.create(userId, {
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
        pricePerItem,
        magazineCapacity,
        gunIds,
      });

      if (accessory) {
        res.status(201).json(accessory);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates an existing accessory item.
   *
   * @param {*} req
   * @param {*} res
   */
  static async update(req, res) {
    const userId = req.user.id;
    const { id } = req.params;
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
      pricePerItem,
      magazineCapacity,
      gunIds,
    } = req.body;

    const accessory = await AccessoryService.read(id);
    if (!accessory) {
      return res
        .status(404)
        .json(new ClientMessage(true, ['Accessory not found']));
    }

    if (accessory.userId !== userId) {
      return res.status(401).send();
    }

    try {
      const updatedAccessory = await AccessoryService.update(userId, id, {
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
        pricePerItem,
        magazineCapacity,
        gunIds,
      });

      if (updatedAccessory) {
        res.status(200).json(updatedAccessory);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads an accessory item by ID.
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
      const accessory = await AccessoryService.read(id);

      if (accessory) {
        if (accessory.userId !== userId) {
          return res.status(401).send();
        }

        return res.status(200).json(accessory);
      } else {
        return res
          .status(404)
          .json(new ClientMessage(true, ['Accessory not found']));
      }
    } catch (error) {
      return res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads all accessories for a user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async all(req, res) {
    const userId = req.user.id;

    try {
      const accessories = await AccessoryService.all(userId);

      if (accessories) {
        return res.status(200).json(accessories);
      } else {
        return res
          .status(404)
          .json(new ClientMessage(true, ['Accessories not found']));
      }
    } catch (error) {
      return res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Deletes an accessory item by ID.
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
      const accessory = await AccessoryService.read(id);
      if (!accessory) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (accessory.userId !== userId) {
        return res.status(401).send();
      }

      const success = await AccessoryService.delete(id);
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

module.exports = AccessoryController;
