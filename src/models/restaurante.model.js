const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle     : String,
  zona      : String,
  municipio : String
}, { _id: false });

const restauranteSchema = new mongoose.Schema({
  nombre   : { type: String, required: true },
  telefono : String,
  direccion: direccionSchema
});

module.exports = mongoose.model('Restaurante', restauranteSchema);
