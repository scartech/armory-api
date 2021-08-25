const { validationResult } = require('express-validator');
const Gun = require('../models/Gun');

class GunsController {
  static async create(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        let message = '';
        errors.errors.map((error) => {
          message += error.msg + ' ';
        });
        return res.status(400).send(message);
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
      const gun = await Gun.findOne({
        where: {
          serialNumber,
        },
      });

      if (gun) {
        return res
          .status(400)
          .send('A gun already exists with this serial number.');
      }

      Gun.create({
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
      })
        .then((gun) => {
          Gun.findByPk(gun.id)
            .then((gun) => res.status(200).json(gun))
            .catch((error) => res.status(500).send(error.message));
        })
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async user(req, res, next) {
    const { id } = req.params;

    try {
      User.findByPk(id)
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }
}
