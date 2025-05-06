const Restaurante = require('../models/restaurant.model');

exports.findAll = async (req, res) => {
  try {
    const restaurantes = await Restaurante.find();
    res.json(restaurantes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener restaurantes' });
  }
};
