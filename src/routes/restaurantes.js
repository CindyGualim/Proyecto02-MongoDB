const router = require('express').Router();
const Restaurante = require('../models/restaurante.model');

// GET todos
router.get('/', async (_,res)=>{
  const data = await Restaurante.find();
  res.json(data);
});

// POST (crear uno) – ejemplo CRUD
router.post('/', async (req,res)=>{
  const nuevo = new Restaurante(req.body);
  const guardado = await nuevo.save();
  res.status(201).json(guardado);
});

// GET /api/restaurantes/top   → 5 con mejor promedio de reseñas
const Resena = require('../models/resena.model');

router.get('/top', async (_,res)=>{
  const top = await Resena.aggregate([
    { $group : { _id:'$restaurante', promedio:{ $avg:'$calificacion' }, total:{ $sum:1 } } },
    { $sort  : { promedio:-1, total:-1 } },
    { $limit : 5 },
    { $lookup:{
        from:'restaurantes',
        localField:'_id',
        foreignField:'_id',
        as:'rest'
      }},
    { $unwind:'$rest' },
    { $project:{
        _id:'$rest._id',
        nombre:'$rest.nombre',
        promedio:1
      }}
  ]);
  res.json(top);
});


module.exports = router;
