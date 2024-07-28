const { Router } = require('express');
const { getPedidosProveedorByMonth } = require('../controllers/reportes.controller');
const router = Router();
//reporte de todos los pedidos que tiene un proveedor en un mes
router.get('/pedidosproveedorpormes/:id_proveedor', getPedidosProveedorByMonth);

module.exports = router;