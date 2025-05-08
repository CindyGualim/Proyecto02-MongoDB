const router = require('express').Router();
const Resena = require('../models/resena.model');

// GET /api/mejores?skip=0&limit=10
router.get('/', async (req,res)=>{
  const skip  = parseInt(req.query.skip)  || 0;
  const limit = parseInt(req.query.limit) || 10;

  const top = await Resena.aggregate([
    { $group:{
        _id:"$restaurante",
        avgRating:{ $avg:"$calificacion" },
        totalResenas:{ $sum:1 }
    }},
    { $sort:{ avgRating:-1, totalResenas:-1 } },
    { $skip: skip },
    { $limit: limit },
    { $lookup:{
        from:'restaurantes',
        localField:'_id',
        foreignField:'_id',
        as:'rest'
    }},
    { $unwind:'$rest' },
    { $project:{
        restauranteId:'$rest._id',
        nombre:'$rest.nombre',
        municipio:'$rest.direccion.municipio',
        avgRating:1,
        totalResenas:1,
        _id:0
    }}
  ]);

  res.json(top);
});

module.exports = router;
