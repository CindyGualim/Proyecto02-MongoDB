// models/Restaurant.js
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String },
  direccion: {
    calle: String,
    zona: Number,
    municipio: String,
    departamento: String,
  },
  geopoint: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],  // [longitud, latitud]
      default: [0, 0]
    }
  }
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
