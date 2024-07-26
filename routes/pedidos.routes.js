const { Router } = require('express');
const { getAllPedidosByColegio, getPedidosByColegioAndFecha, getPedidosByProveedorAndFecha, postPedido, postDetallePedido, deleteDetallePedido, deletePedido, fullDetallePedido, getPedidosByProveedor, modificarEstadoPedido } = require('../controllers/pedidos.controller');
const router = Router();
//api para mostrar todos los pedidos (fechas) de un colegio
router.get('/pedidosbycolegio/:id_colegio', getAllPedidosByColegio);
//solicitar pedidos dependiendo del id del colegio y la fecha
router.get('/pedidobycolegioandfecha', getPedidosByColegioAndFecha);
//solicitar pedidos dependiendo del id_del proveedor y la fecha (que pedidos tiene un proveedor en determinada fecha)
router.get('/pedidobyproveedorandfecha', getPedidosByProveedorAndFecha);
//mostrar todos los pedidos de un proveedor
router.get('/allpedidosbyproveedor/:id_proveedor',getPedidosByProveedor);
//crear un pedido
router.post('/createpedido',postPedido);
//crear detalle del pedido
router.post('/createdetallepedido',postDetallePedido);
//eliminar detalle del pedido
router.delete('/deletedetallepedido/:id_pedido',deleteDetallePedido);
//eliminar pedido
router.delete('/deletepedido/:id_pedido',deletePedido);
//mostrar informacion acerca del pedido
router.get('/informacionpedido/:id_pedido',fullDetallePedido);
//modificar el estado del pedido
router.put('/modestadopedido/:id_pedido',modificarEstadoPedido);
module.exports = router;