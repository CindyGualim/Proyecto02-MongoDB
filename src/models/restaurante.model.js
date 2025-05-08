const mongoose = require('mongoose');

const direccionSchema = new mongoose.Schema({
  calle     : String,
  zona      : Number,
  municipio : String,
  departamento: String
}, { _id:false });

const restauranteSchema = new mongoose.Schema({
  nombre   : { type:String, required:true },
  telefono : String,
  direccion: direccionSchema,
  geopoint : {
    type       : { type:String, enum:['Point'], default:'Point' },
    coordinates: { type:[Number], default:[0,0] }    // [lon,lat]
  }
});

/* ---------- ÍNDICES para la rúbrica ---------- */
restauranteSchema.index({ nombre:1 });                                 // simple
restauranteSchema.index({ 'direccion.municipio':1, nombre:1 });        // compuesto
restauranteSchema.index({ 'direccion.zona':1 });                       // multikey
restauranteSchema.index({ geopoint:'2dsphere' });                      // geoespacial
restauranteSchema.index({ nombre:'text', 'direccion.municipio':'text' }); // texto

module.exports = mongoose.model('Restaurante', restauranteSchema);
