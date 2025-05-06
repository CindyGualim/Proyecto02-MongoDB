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

module.exports = router;
