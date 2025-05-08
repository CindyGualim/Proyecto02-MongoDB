const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
  restaurante : { type: mongoose.Schema.Types.ObjectId, ref:'Restaurante', required:true },
  items       : [{
    nombre : String,
    precio : Number
  }],
  fecha : { type: Date, default: Date.now },
  estado: { type: String, default: 'en preparación' }
});

module.exports = mongoose.model('Orden', ordenSchema);
