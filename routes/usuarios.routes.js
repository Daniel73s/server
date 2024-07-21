const { Router } = require('express');
const { postUsuario, updateEstadoUsuario, updatePasswordAdmin} = require('../controllers/usuarios.controller');
const router = Router();
//Agregar un nuevo usuario
router.post('/', postUsuario);
//actualizar el estado del usuario
router.put('/estado/:usuario', updateEstadoUsuario);
//actualizar password
router.put('/updatepass',updatePasswordAdmin);

module.exports = router;