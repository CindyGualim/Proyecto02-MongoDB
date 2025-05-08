const router = require('express').Router();
const Orden = require('../models/orden.model');

router.post('/', async (req,res)=>{
  const nueva = new Orden(req.body);
  const guardada = await nueva.save();
  res.status(201).json(guardada);
});

module.exports = router;
