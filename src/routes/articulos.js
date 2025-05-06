const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articulo.controller');

// Rutas
router.get('/articule', articuloController.findAll);

module.exports = router;
