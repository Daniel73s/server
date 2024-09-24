const { Router } = require('express');
const { getPedidosProveedorByMonth, getPedidosProveedorByDate, getPedidosColegioByMonth, inicio, getPedidosProveedorByFechas } = require('../controllers/reportes.controller');
const router = Router();
//reporte de todos los pedidos que tiene un proveedor en un mes
router.get('/pedidosproveedorpormes/:id_proveedor', getPedidosProveedorByMonth);
//reporte de todos los pedidos que tiene un proveedor en una fecha especifica
router.get('/pedidosproveedorporfecha/:id_proveedor', getPedidosProveedorByDate);
//reporte de todos los pedidos que tiene un colegio en un mes
router.get('/pedidoscolegiopormes/:id_colegio', getPedidosColegioByMonth);
//informacion para la pantalla de incio del administrador 
router.get('/inicio', inicio);
//informacion para la pantalla de incio del administrador 
router.get('/pedidosproveedorentrefechas/:id_proveedor', getPedidosProveedorByFechas);
module.exports = router;