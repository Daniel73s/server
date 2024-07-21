const { Router } = require('express');
const {uploadImage, updateImage } = require('../controllers/uploads.controller');

const router = Router();
//ruta para subir imagen al servidor
router.post('/',uploadImage);
router.put('/:id',updateImage);
module.exports = router;