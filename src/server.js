const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const rutasUsuario = require('./routes/index');
const rutasRestaurante = require('./routes/restaurant.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', rutasUsuario);
app.use('/api/restaurantes', rutasRestaurante);  // <- Esta línea importa

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
