const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const GunsController = require('../../controllers/guns.controller');
const ClientMessage = require('../../util/ClientMessage');

/**
 * GET /api/guns/{id}
 * @tags Guns
 * @summary Gets a single gun by ID
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @return {Gun} 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
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

/**
 * DELETE /api/guns/{id}
 * @tags Guns
 * @summary Deletes a gun by ID
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @return 200 - success
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
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

/**
 * PUT /api/guns/{id}
 * @tags Guns
 * @summary Updates a gun
 * @security BearerAuth
 * @param {integer} id.path - Gun ID
 * @param {Gun} request.body.required - Gun info
 * @return {Gun} 200 - success - The updated gun
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
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

/**
 * POST /api/guns
 * @tags Guns
 * @summary Creates a new gun
 * @security BearerAuth
 * @param {Gun} request.body.required - Gun info
 * @return {Gun} 201 - created - The created gun
 * @return 401 - Invalid or missing JWT
 * @return {ClientMessage} 400 - Invalid ID
 * @return {ClientMessage} 404 - The gun was not found
 * @return {ClientMessage} 500 - A server error occurred
 */
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
      res.status(201).json(gun);
    } else {
      res.status(500).json(new ClientMessage(true, ['Create failed']));
    }
  } catch (error) {
    res.status(500).json(new ClientMessage(true, [error.message]));
  }
});

module.exports = router;
