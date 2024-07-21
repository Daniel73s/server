const { Router } = require('express');
const { getAllCategorias, PostCategoria, getFindOneCategoria, UpdateCategoria, UpdateEstadoCategoria, getAllCategoriasValidas } = require('../controllers/categorias.controller');

const router = Router();
//solicitar informacion de todas las categorias
router.get('/', getAllCategorias);
router.get('/validas', getAllCategoriasValidas);
router.get('/:id', getFindOneCategoria);
router.post('/', PostCategoria);
router.patch('/:id',UpdateCategoria)
router.patch('/estado/:id',UpdateEstadoCategoria)
module.exports = router;