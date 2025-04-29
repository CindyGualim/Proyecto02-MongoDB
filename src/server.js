require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rutas = require('./routes/index');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Usar rutas
app.use('/api', rutas);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB conectado'))
.catch(err => console.error(' Error en MongoDB:', err));

// Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
