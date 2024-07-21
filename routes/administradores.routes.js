const { Router } = require('express');
const { getAllAdministradores, PostUbicacionAdministrador, PostAdministrador, AgregarUser, getOneAdministrador } = require('../controllers/administradores.controller');
const router = Router();
//solicitar informacion de todos los administradores
router.get('/',getAllAdministradores);
//solicitar toda la informcaion de un solo administrador
router.get('/one/:id',getOneAdministrador);
//agregar informacion de la ubicacion de administrador
router.post('/ubicacion', PostUbicacionAdministrador);
//agregar informacion de propiamente del administrador
router.post('/', PostAdministrador);
//agregar el usuario a un administrador
router.post('/usuario/:id',AgregarUser);
module.exports = router;