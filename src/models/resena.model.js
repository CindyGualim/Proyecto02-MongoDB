const mongoose = require('mongoose');

const resenaSchema = new mongoose.Schema({
  restaurante : { type: mongoose.Schema.Types.ObjectId, ref:'Restaurante', required:true },
  calificacion: { type: Number, min:1, max:5, required:true },
  comentario  : String,
  fecha       : { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resena', resenaSchema);
