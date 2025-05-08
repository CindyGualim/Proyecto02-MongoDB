/* routes/articulos.js */
const express  = require('express');
const router   = express.Router();
const Articulo = require('../models/Articulo');

/* ─────────────── Crear un platillo ─────────────── */
router.post('/', async (req, res) => {
  try {
    const nuevo = new Articulo(req.body);
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ─────────────── Todos los platillos ───────────── */
router.get('/', async (_req, res) => {
  try {
    const articulos = await Articulo.find();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

/* ─────────────── Platillos de UN restaurante ───── */
router.get('/restaurante/:id', async (req, res) => {
  try {
    const { id } = req.params;                      // ← id del restaurante
    const articulos = await Articulo.find({ restauranteId: id });
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener menú' });
  }
});

module.exports = router;
