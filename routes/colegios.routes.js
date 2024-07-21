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
    updateContacto,
    AgregarUserCol} = require('../controllers/colegios.controller');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();
//solicitar informacion de todos los colegios
router.get('/', getAllColegios);
// router.get('/',[validarJWT], getAllColegios);
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
//asignar usuario a un colegio
router.post('/usuario/:id',AgregarUserCol);
module.exports = router;