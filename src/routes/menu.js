const router = require('express').Router();
const MenuItem = require('../models/menuItem.model');

// GET /api/menus/:restId
router.get('/:restId', async (req,res)=>{
  const menu = await MenuItem.find({ restauranteId: req.params.restId });
  res.json(menu);
});

module.exports = router;
