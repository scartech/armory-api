const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const GunsController = require('../../controllers/guns.controller');

router.get('/:id', GunsController.read);
router.delete('/:id', GunsController.delete);
router.put('/:id', GunsController.update);
router.post('/', GunsController.create);

module.exports = router;
