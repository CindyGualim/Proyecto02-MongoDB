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

//  Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find();
    res.json(articulos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener artículos' });
  }
});

router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find().populate('restauranteId', 'nombre');
    
    // Para que en el frontend sea fácil comparar:
    const articulosConNombre = articulos.map((articulo) => ({
      _id: articulo._id,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      precio: articulo.precio,
      restauranteId: articulo.restauranteId._id.toString(),
      restauranteNombre: articulo.restauranteId.nombre
    }));

    res.json(articulosConNombre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
