const Usuario = require('../models/usuario.model');

// REGISTRO
exports.create = async (req, res) => {
  try {
    const { nombre, correo, password } = req.body;

    if (!nombre || !correo || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existente = await Usuario.findOne({ correo });
    if (existente) {
      return res.status(409).json({ message: 'Correo ya registrado' });
    }

    const nuevo = new Usuario({ nombre, correo, password });
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ message: 'Campos obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Login exitoso', usuario });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
