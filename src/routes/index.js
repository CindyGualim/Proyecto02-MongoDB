// routes/index.js
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const articulosRoutes = require('./articulos');
const restauranteRoutes = require('./restaurantes'); // <- Asegúrate que el nombre coincida con el archivo creado
//const ordenesRoutes = require('./ordenes');

router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);

router.use('/articulos', articulosRoutes);
router.use('/restaurantes', restauranteRoutes);
//router.use('/ordenes', ordenesRoutes);

module.exports = router;
