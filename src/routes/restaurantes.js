// src/routes/restaurantes.js
const router = require('express').Router();
const Restaurante = require('../models/restaurante.model');   // ← nombre correcto

router.get('/', async (_, res) => {
  const all = await Restaurante.find();
  res.json(all);
});

module.exports = router;
