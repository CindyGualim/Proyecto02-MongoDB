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

const ordenSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  restauranteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurante', required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'en preparación' },
  platillos: [
    {
      articuloId: { type: mongoose.Schema.Types.ObjectId, ref: 'Articulo' },
      nombre: String,
      cantidad: Number,
      precio_unitario: Number
    }
  ],
  total: Number
});
const Orden = mongoose.model('Orden', ordenSchema);

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
      if (!correo || !password || !nombre) return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
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
      res.json({ token, usuario: { nombre: usuario.nombre, correo: usuario.correo } });
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
  },
  obtenerArticulo: async (req, res) => {
    try {
      const articulo = await Articulo.findById(req.params.id);
      if (!articulo) return res.status(404).json({ mensaje: 'Artículo no encontrado' });
      res.json(articulo);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener artículo', error });
    }
  }
};

// CARRITO TEMPORAL EN MEMORIA
const carritos = {};
const carritoController = {
  agregarAlCarrito: (req, res) => {
    const { articuloId, cantidad } = req.body;
    const userId = req.usuarioId;
    if (!carritos[userId]) carritos[userId] = [];
    carritos[userId].push({ articuloId, cantidad });
    res.json({ mensaje: 'Artículo agregado al carrito', carrito: carritos[userId] });
  },
  verCarrito: (req, res) => {
    const userId = req.usuarioId;
    res.json(carritos[userId] || []);
  }
};

// CONTROLADORES ORDENES
const ordenController = {
  listarOrdenesUsuario: async (req, res) => {
    try {
      const ordenes = await Orden.find({ usuarioId: req.usuarioId });
      res.json(ordenes);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener pedidos', error });
    }
  },
  verOrdenPorId: async (req, res) => {
    try {
      const orden = await Orden.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
      if (!orden) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
      res.json(orden);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener pedido', error });
    }
  },
  crearOrden: async (req, res) => {
    try {
      const { restauranteId, platillos } = req.body;
      if (!restauranteId || !Array.isArray(platillos) || platillos.length === 0) {
        return res.status(400).json({ mensaje: 'Datos de orden incompletos' });
      }
      let total = 0;
      const detalles = [];
      for (const item of platillos) {
        const articulo = await Articulo.findById(item.articuloId);
        if (!articulo) return res.status(404).json({ mensaje: `Artículo no encontrado: ${item.articuloId}` });
        detalles.push({
          articuloId: articulo._id,
          nombre: articulo.nombre,
          cantidad: item.cantidad,
          precio_unitario: articulo.precio
        });
        total += articulo.precio * item.cantidad;
      }
      const nuevaOrden = new Orden({
        usuarioId: req.usuarioId,
        restauranteId,
        platillos: detalles,
        total
      });
      await nuevaOrden.save();
      res.status(201).json({ mensaje: 'Orden creada', orden: nuevaOrden });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al crear orden', error });
    }
  },
  cancelarOrden: async (req, res) => {
    try {
      const orden = await Orden.findOne({ _id: req.params.id, usuarioId: req.usuarioId });
      if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada' });
      if (orden.estado === 'entregado') {
        return res.status(400).json({ mensaje: 'No se puede cancelar una orden entregada' });
      }
      orden.estado = 'cancelado';
      await orden.save();
      res.json({ mensaje: 'Orden cancelada' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al cancelar orden', error });
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
app.get('/api/articulos/:id', articuloController.obtenerArticulo);

app.get('/api/ordenes', authMiddleware, ordenController.listarOrdenesUsuario);
app.get('/api/ordenes/:id', authMiddleware, ordenController.verOrdenPorId);
app.post('/api/ordenes', authMiddleware, ordenController.crearOrden);
app.put('/api/ordenes/:id/cancelar', authMiddleware, ordenController.cancelarOrden);

app.post('/api/carrito', authMiddleware, carritoController.agregarAlCarrito);
app.get('/api/carrito', authMiddleware, carritoController.verCarrito);

// CONEXIÓN A MONGODB Y SERVIDOR
console.log('Conectando a:', process.env.MONGODB_URI); // Debug temporal

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(process.env.PORT || 3000, () => console.log('Servidor corriendo en puerto 3000'));
  })
  .catch(err => console.error('Error al conectar a MongoDB:', err));
