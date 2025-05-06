const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// Ruta GET para obtener todos los restaurantes
router.get('/', restaurantController.findAll);

module.exports = router;
