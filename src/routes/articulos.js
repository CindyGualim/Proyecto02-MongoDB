const express = require('express');
const router = express.Router();
const Articulo = require('../models/articulo.js');

// Ruta para agregar un artículo
router.post('/', async (req, res) => {
  try {
    const nuevoArticulo = new Articulo(req.body);
    await nuevoArticulo.save();
    res.status(201).json(nuevoArticulo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

module.exports = router;
