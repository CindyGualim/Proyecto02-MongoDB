const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ mensaje: 'Token no proporcionado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = decoded.id;
    next(); // deja pasar a la siguiente función (el controlador)
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};
