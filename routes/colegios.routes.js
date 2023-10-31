const { Router } = require('express');
const { getAllColegios,
    postColegio,
    deleteColegio,
    habilitarColegio,
    ubicacionColegio,
    contactoColegio,
    getFindOneColegio,
    updateColegio, 
    updateUbicacion,
    updateContacto} = require('../controllers/colegios.controller');
const router = Router();
//solicitar informacion de todos los colegios
router.get('/', getAllColegios);
//solicitar informacion de un colegio
router.get('/:id', getFindOneColegio);
//crear un nuevo colegio
router.post('/', postColegio);
router.post('/ubicacion_colegio', ubicacionColegio);
router.post('/contacto_colegio', contactoColegio);
//Actualizar datos del coelgio
router.patch('/:id', updateColegio);
router.patch('/updateUbicacion/:id',updateUbicacion);
router.patch('/updateContacto/:id',updateContacto);
//dar de baja a colegio
router.delete('/:id', deleteColegio);
//habilitar colegio
router.delete('/habilitar/:id', habilitarColegio);

module.exports = router;