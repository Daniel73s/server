const { Router } = require('express');
const { loginApp } = require('../controllers/auth.controller');
const router = Router();
//solicitar informacion de todas las categorias
router.post('/login_app',loginApp);
module.exports = router;