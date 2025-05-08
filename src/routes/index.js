// routes/index.js
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const articulosRoutes = require('./articulos');
const restauranteRoutes = require('./restaurant'); // <- Asegúrate que el nombre coincida con el archivo creado
//const ordenesRoutes = require('./ordenes');

router.post('/usuarios', usuarioController.create);
router.post('/login', usuarioController.login);

router.use('/articulos', articulosRoutes);
router.use('/restaurant', restauranteRoutes); // <- Usa esta ruta
//router.use('/ordenes', ordenesRoutes);

module.exports = router;
