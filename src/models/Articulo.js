const mongoose = require('mongoose');

const ArticuloSchema = new mongoose.Schema({
  restauranteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurante',
    required: true
  },
  nombre: { type: String, required: true },
  descripcion: String,
  precio: Number,
});

module.exports = mongoose.model('Articulo', ArticuloSchema);
