const mongoose = require('mongoose');

const ArticuloSchema = new mongoose.Schema({
  restauranteId: String,
  nombre: String,
  descripcion: String,
  precio: Number,
});

module.exports = mongoose.model('Articulo', ArticuloSchema);
