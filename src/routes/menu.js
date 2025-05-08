const router    = require('express').Router();
const MenuItem  = require('../models/menuitem.model');

// GET  /api/menus/:restId    → lista de platillos de un restaurante
router.get('/:restId', async (req, res) => {
  try {
    const menu = await MenuItem.find({ restauranteId: req.params.restId });
    res.json(menu);
  } catch (e) {
    res.status(500).json({ message: 'Error al obtener menú', e });
  }
});

module.exports = router;
