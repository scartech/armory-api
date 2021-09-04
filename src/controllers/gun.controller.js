const { validationResult } = require('express-validator');
const { GunService } = require('../services/');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the Guns model.
 */
class GunController {
  /**
   * Creates a new gun.
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const {
      serialNumber,
      name,
      modelName,
      manufacturer,
      caliber,
      type,
      action,
      dealer,
      purchasePrice,
      purchaseDate,
      buyer,
      salePrice,
      saleDate,
    } = req.body;

    try {
      const gun = await GunService.create(req.user.id, {
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      });

      if (gun) {
        res.status(201).json(gun);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads a gun by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async read(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const gun = await GunService.read(id);
      if (gun) {
        res.status(200).json(gun);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates a gun by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async update(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const gun = await GunService.read(id);
      if (!gun) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const {
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      } = req.body;

      const updatedGun = await GunService.update(id, {
        serialNumber,
        name,
        modelName,
        manufacturer,
        caliber,
        type,
        action,
        dealer,
        purchasePrice,
        purchaseDate,
        buyer,
        salePrice,
        saleDate,
      });

      if (updatedGun) {
        res.status(200).json(updatedGun);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Deletes a gun by ID.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async delete(req, res) {
    const { id } = req.params;

    if (isNaN(id)) {
      return res
        .status(400)
        .json(new ClientMessage(true, ['Invalid parameter']));
    }

    try {
      const gun = await GunService.read(id);
      if (!gun) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      const success = await GunService.delete(id);
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
   * Gets all guns for the logged in user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async guns(req, res) {
    try {
      const guns = await GunService.guns(req.user.id);
      if (guns) {
        res.status(200).json(guns);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = GunController;
