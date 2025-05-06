const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const articulosRoutes = require('./articulos');
const restauranteRoutes = require('./restaurant.routes');

router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);

// Rutas
router.use('/articulos', articulosRoutes);
router.use('/restaurantes', restauranteRoutes);

module.exports = router;
