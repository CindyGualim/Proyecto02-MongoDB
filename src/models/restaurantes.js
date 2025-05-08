const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle: String,
  zona: String,
  municipio: String,
  departamento: String,
});

const restauranteSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  direccion: direccionSchema,
  geopoint: {
    lat: Number,
    lng: Number
  }
});

module.exports = mongoose.model('Restaurante', restauranteSchema);
