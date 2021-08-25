const { validationResult } = require('express-validator');
const Gun = require('../models/Gun');
const User = require('../models/User');

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

      const user = await User.findByPk(req.user.id);

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
        userId: user.id,
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

  static async read(req, res, next) {
    const { id } = req.params;

    try {
      Gun.findByPk(id)
        .then((gun) => res.status(200).json(gun))
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;

    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        return res.status(400).send('Gun does not exist.');
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

      Gun.update(
        {
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
        },
        {
          where: {
            id: parseInt(id),
          },
        },
      )
        .then(() => res.status(200).send())
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;

    try {
      const gun = await Gun.findByPk(id);
      if (!gun) {
        return res.status(400).send('Gun does not exist.');
      }

      Gun.destroy({
        where: {
          id,
        },
      })
        .then(() => res.status(200).send())
        .catch((error) => res.status(500).send(error.message));
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = GunsController;
