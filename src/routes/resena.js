const router = require('express').Router();
const Resena = require('../models/resena.model');

router.post('/', async (req,res)=>{
  const nueva = new Resena(req.body);
  const guardada = await nueva.save();
  res.status(201).json(guardada);
});

module.exports = router;
