// routes/restaurantes.js
const express = require('express');
const router = express.Router();
const Restaurante = require('../models/Restaurant');
const Articulo = require('../models/articulo');

// GET /api/restaurantes/con-platos
router.get('/con-platos', async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();

    const resultado = await Promise.all(
      restaurantes.map(async (rest) => {
        const platos = await Articulo.find({ restauranteId: rest._id.toString() });
        return {
          _id: rest._id,
          nombre: rest.nombre,
          telefono: rest.telefono,
          direccion: rest.direccion,
          geopoint: rest.geopoint,
          platos: platos
        };
      })
    );

    res.json(resultado);
  } catch (err) {
    console.error('Error al obtener restaurantes con platos:', err);
    res.status(500).json({ error: 'Error al obtener restaurantes con platos' });
  }
});

module.exports = router;
