const router = require('express').Router();
const MenuItem = require('../models/menuitem.model');

// POST /api/articulos/bulk   (body = [ {...}, {...} ])
router.post('/', async (req,res)=>{
  await MenuItem.insertMany(req.body, { ordered:false });
  res.status(201).json({ ok:true, total:req.body.length });
});

module.exports = router;
