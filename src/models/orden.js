const mongoose = require('mongoose');

const OrdenSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  restauranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'en preparación' },
  platillos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Articulo' }],
  total: Number
});

module.exports = mongoose.model('Orden', OrdenSchema);
