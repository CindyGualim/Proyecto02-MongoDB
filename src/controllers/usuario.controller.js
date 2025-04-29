exports.login = async (req, res) => {
    const { correo, password } = req.body;
  
    if (!correo || !password) {
      return res.status(400).json({ message: 'Campos obligatorios' });
    }
  
    try {
      const Usuario = require('../models/usuario.model');
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
  