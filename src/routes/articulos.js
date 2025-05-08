const express = require('express');
const router = express.Router();
const Articulo = require('../models/articulo.js');
const Restaurante = require('../models/restaurante.js'); // Importa el modelo Restaurante

// Ruta para agregar un artículo
router.post('/', async (req, res) => {
  try {
    // Verificar que el restaurante existe
    const restaurante = await Restaurante.findById(req.body.restauranteId);
    if (!restaurante) {
      return res.status(400).json({ error: 'Restaurante no encontrado' });
    }

    // Crear un nuevo artículo si el restaurante existe
    const nuevoArticulo = new Articulo(req.body);
    await nuevoArticulo.save();
    res.status(201).json(nuevoArticulo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Ruta para obtener todos los artículos
router.get('/', async (req, res) => {
  try {
    const articulos = await Articulo.find().populate('restauranteId', 'nombre');
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

// Ruta para eliminar un artículo por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la URL

  try {
    // Buscar y eliminar el artículo por ID
    const articuloEliminado = await Articulo.findByIdAndDelete(id);

    if (!articuloEliminado) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    res.status(200).json({ message: 'Artículo eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el artículo' });
  }
});

module.exports = router;
