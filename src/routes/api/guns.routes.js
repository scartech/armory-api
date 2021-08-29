const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const GunsController = require('../../controllers/guns.controller');
const ClientMessage = require('../../util/ClientMessage');

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const gun = await GunsController.read(id);
    if (gun) {
      res.status(200).json(gun);
    } else {
      res.status(404).json(new ClientMessage(true, ['Not found']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const gun = await GunsController.read(id);
    if (!gun) {
      return res.status(404).json(new ClientMessage(true, ['Not found']));
    }

    const success = await GunsController.delete(id);
    if (success) {
      res.status(200).send();
    } else {
      res.status(500).json(new ClientMessage(true, ['Delete failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json(new ClientMessage(true, ['Invalid parameter']));
  }

  try {
    const gun = await GunsController.read(id);
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

    const updatedGun = await GunsController.update(id, {
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
});

router.post('/', async (req, res) => {
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
    const gun = await GunsController.create(req.user.id, {
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
      res.status(200).json(gun);
    } else {
      res.status(500).json(new ClientMessage(true, ['Create failed']));
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

module.exports = router;
