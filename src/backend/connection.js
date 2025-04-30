const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

app.use(express.json());

// MODELOS
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fechaRegistro: { type: Date, default: Date.now }
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

const restauranteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String },
  direccion: {
    calle: String,
    zona: Number,
    municipio: String,
    departamento: String,
    geopoint: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true }
    }
  }
});
restauranteSchema.index({ 'direccion.geopoint': '2dsphere' });
const Restaurante = mongoose.model('Restaurante', restauranteSchema);

const articuloSchema = new mongoose.Schema({
  restauranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true }
});
const Articulo = mongoose.model('Articulo', articuloSchema);

// MIDDLEWARE DE AUTENTICACION
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ mensaje: 'Token no proporcionado' });
  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decodificado.id;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// CONTROLADORES USUARIO
const usuarioController = {
  register: async (req, res) => {
    try {
      const { nombre, correo, password } = req.body;
      const existe = await Usuario.findOne({ correo });
      if (existe) return res.status(400).json({ mensaje: 'Correo ya registrado' });
      const hash = await bcrypt.hash(password, 10);
      const nuevoUsuario = new Usuario({ nombre, correo, password: hash });
      await nuevoUsuario.save();
      res.status(201).json({ mensaje: 'Usuario creado correctamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al registrar usuario', error });
    }
  },
  login: async (req, res) => {
    try {
      const { correo, password } = req.body;
      const usuario = await Usuario.findOne({ correo });
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      const coincide = await bcrypt.compare(password, usuario.password);
      if (!coincide) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
      const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
    }
  },
  getPerfil: async (req, res) => {
    try {
      const usuario = await Usuario.findById(req.usuarioId).select('-password');
      if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener perfil', error });
    }
  }
};

// CONTROLADORES RESTAURANTE
const restauranteController = {
  listarRestaurantes: async (req, res) => {
    try {
      const restaurantes = await Restaurante.find();
      res.json(restaurantes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar restaurantes', error });
    }
  },
  buscarRestaurantesPorNombre: async (req, res) => {
    try {
      const nombre = req.params.nombre;
      const restaurantes = await Restaurante.find({ nombre: { $regex: `^${nombre}`, $options: 'i' } });
      res.json(restaurantes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al buscar restaurantes', error });
    }
  },
  restaurantesCercanos: async (req, res) => {
    try {
      const { lat, lng, maxKm } = req.query;
      const restaurantes = await Restaurante.find({
        'direccion.geopoint': {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: parseFloat(maxKm) * 1000
          }
        }
      });
      res.json(restaurantes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al buscar restaurantes cercanos', error });
    }
  }
};

// CONTROLADORES ARTICULO
const articuloController = {
  listarArticulosDeRestaurante: async (req, res) => {
    try {
      const restauranteId = req.params.id;
      const articulos = await Articulo.find({ restauranteId });
      res.json(articulos);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al listar articulos', error });
    }
  }
};

// RUTAS
app.post('/api/usuarios/register', usuarioController.register);
app.post('/api/usuarios/login', usuarioController.login);
app.get('/api/usuarios/me', authMiddleware, usuarioController.getPerfil);

app.get('/api/restaurantes', restauranteController.listarRestaurantes);
app.get('/api/restaurantes/buscar/:nombre', restauranteController.buscarRestaurantesPorNombre);
app.get('/api/restaurantes/cercanos', restauranteController.restaurantesCercanos);

app.get('/api/articulos/restaurante/:id', articuloController.listarArticulosDeRestaurante);

// CONEXIÓN A MONGODB Y SERVIDOR
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(process.env.PORT || 3000, () => console.log('🚀 Servidor corriendo en puerto 3000'));
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
