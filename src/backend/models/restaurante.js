const mongoose = require('mongoose');


const restauranteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
  },
  direccion: {
    calle: String,
    zona: Number,
    municipio: String,
    departamento: String,
    geopoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitud, latitud]
        required: true
      }
    }
  }
});

restauranteSchema.index({ 'direccion.geopoint': '2dsphere' });

module.exports = mongoose.model('restaurante', restauranteSchema);

