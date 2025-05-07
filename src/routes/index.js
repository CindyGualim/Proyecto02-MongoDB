// routes/index.js
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const articulosRoutes = require('./articulos');
const restauranteRoutes = require('./restaurantes'); // <- Asegúrate que el nombre coincida con el archivo creado

router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);

router.use('/articulos', articulosRoutes);
router.use('/restaurantes', restauranteRoutes); // <- Usa esta ruta

module.exports = router;
