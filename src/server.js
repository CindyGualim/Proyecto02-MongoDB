// 1) Cargar variables de entorno
require('dotenv').config();

// 2) Importar librerías
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// 3) Crear la app de Express
const app = express();

// 4) Middlewares
app.use(cors());               // Permite peticiones desde el frontend
app.use(express.json());       // Parsear JSON en el body

// 5) Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB conectado'))
.catch(err => console.error(' Error en MongoDB:', err));

// 6) Rutas de prueba
app.get('/', (req, res) => {
  res.send('¡API viva y coleando!');
});

// 7) Levantar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
});
