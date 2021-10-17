const { AmmoService } = require('../services/');
const ClientMessage = require('../utils/ClientMessage');

/**
 * Handles HTTP requests for the Ammo model.
 */
class AmmoController {
  /**
   * Creates new ammo.
   *
   * @param {*} req
   * @param {*} res
   */
  static async create(req, res) {
    const {
      name,
      brand,
      caliber,
      weight,
      bulletType,
      muzzleVelocity,
      purchasedFrom,
      purchasePrice,
      purchaseDate,
      roundCount,
      pricePerRound,
    } = req.body;

    try {
      const ammo = await AmmoService.create(req.user.id, {
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      });

      if (ammo) {
        res.status(201).json(ammo);
      } else {
        res.status(500).json(new ClientMessage(true, ['Create failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Reads ammo by ID.
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
      const ammo = await AmmoService.read(id);
      if (ammo) {
        if (ammo.userId !== userId) {
          return res.status(401).send();
        }

        res.status(200).json(ammo);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Updates ammo by ID.
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
      const ammo = await AmmoService.read(id);
      if (!ammo) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (ammo.userId !== userId) {
        return res.status(401).send();
      }

      const {
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      } = req.body;

      const updatedAmmo = await AmmoService.update(id, {
        name,
        brand,
        caliber,
        weight,
        bulletType,
        muzzleVelocity,
        purchasedFrom,
        purchasePrice,
        purchaseDate,
        roundCount,
        pricePerRound,
      });

      if (updatedAmmo) {
        res.status(200).json(updatedAmmo);
      } else {
        res.status(500).json(new ClientMessage(true, ['Update failed']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }

  /**
   * Deletes ammo by ID.
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
      const ammo = await AmmoService.read(id);
      if (!ammo) {
        return res.status(404).json(new ClientMessage(true, ['Not found']));
      }

      if (ammo.userId !== userId) {
        return res.status(401).send();
      }

      const success = await AmmoService.delete(id);
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
   * Gets ammo for the logged in user.
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async ammo(req, res) {
    try {
      const ammo = await AmmoService.ammo(req.user.id);
      if (ammo) {
        res.status(200).json(ammo);
      } else {
        res.status(404).json(new ClientMessage(true, ['Not found']));
      }
    } catch (error) {
      res.status(500).json(new ClientMessage(true, [error.message]));
    }
  }
}

module.exports = AmmoController;
