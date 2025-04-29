const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');

// Rutas
router.get('/', restaurantController.findAll);
router.post('/', restaurantController.create);  // ← nueva ruta POST

module.exports = router;
