const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restauranteId : { type: mongoose.Schema.Types.ObjectId, ref:'Restaurante', required:true },
  nombre        : { type: String, required:true },
  descripcion   : String,
  precio        : { type: Number, required:true }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
