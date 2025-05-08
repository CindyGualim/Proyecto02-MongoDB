const express = require('express');
const router = express.Router();
const Restaurante = require('../models/restaurantes');

// GET /api/restaurantes
router.get('/', async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (err) {
    console.error('Error al obtener restaurantes:', err);
    res.status(500).json({ error: 'Error al obtener restaurantes' });
  }
});

module.exports = router;
