const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const rutasUsuario = require('./routes/index');
const rutasRestaurante = require('./routes/restaurantes');
const menuRoutes   = require('./routes/menu');
const ordenRoutes  = require('./routes/orden');
const resenaRoutes = require('./routes/resena');
const rutasRest = require('./routes/restaurantes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rutasUsuario);
app.use('/api/restaurantes', rutasRestaurante);  // <- Esta línea importa
app.use('/api/menus',   menuRoutes);
app.use('/api/ordenes', ordenRoutes);
app.use('/api/resenas', resenaRoutes);
app.use('/api/restaurantes', rutasRest);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error de conexión:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
