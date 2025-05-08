const express = require('express');
const router  = express.Router();

/* ------------ controladores simples ----------- */
const usuarioController = require('../controllers/usuario.controller');

/* ------------ sub-rutas REST ------------------- */
const articulosRoutes    = require('./articulos');
const restauranteRoutes  = require('./restaurantes');
const menuRoutes         = require('./menu');      //  ← nuevo
const ordenRoutes        = require('./orden');     //  ya existía
const resenaRoutes       = require('./resena');    //  ya existía

/* ----------------- auth & usuarios ------------- */
router.post('/usuarios', usuarioController.create);
router.post('/login',    usuarioController.login);

/* --------------- recursos REST ----------------- */
router.use('/articulos',    articulosRoutes);
router.use('/restaurantes', restauranteRoutes);
router.use('/menus',        menuRoutes);           //  ← nuevo
router.use('/ordenes',      ordenRoutes);
router.use('/resenas',      resenaRoutes);

module.exports = router;
