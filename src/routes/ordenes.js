const express = require('express');
const router = express.Router();
const Orden = require('../models/orden');
const Articulo = require('../models/articulo');

// Crear una orden
router.post('/', async (req, res) => {
  try {
    const { usuarioId, restauranteId, platillos } = req.body;

    // Calcular total
    const articulos = await Articulo.find({ _id: { $in: platillos } });
    const total = articulos.reduce((sum, art) => sum + art.precio, 0);

    const nuevaOrden = new Orden({
      usuarioId,
      restauranteId,
      platillos,
      total
    });

    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'No se pudo crear la orden' });
  }
});

// Cancelar una orden por ID
router.put('/:id/cancelar', async (req, res) => {
  try {
    const orden = await Orden.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelada' },
      { new: true }
    );
    if (!orden) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(orden);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo cancelar la orden' });
  }
});
