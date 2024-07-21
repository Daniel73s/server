const { Router } = require('express');
const { getAllProveedores, createProveedor, createUbicacionProveedor, updateEstadoProveedor, updateCSProveedor, getOneProveedor, updateProveedor, updateUbicacionProveedor, getAllProveedoresActivos, getAllProveedoresInactivos, createUserProveedor, UpdateImageProveedor, productosProveedor, AllProductosProveedor } = require('../controllers/proveedores.controller');
const router = Router();
//solicitar informacion de todos los proveedores
router.get('/', getAllProveedores);
router.get('/activos', getAllProveedoresActivos);
router.get('/one/:id', getOneProveedor);
router.get('/productos/proveedor/:id',productosProveedor);
//obtener todos los productos de un proveedor
router.get('/productos/allproductos/:id',AllProductosProveedor);
router.post('/', createProveedor);
router.post('/ubicacion_proveedor', createUbicacionProveedor);
router.patch('/:id',updateProveedor);
router.patch('/ubicacion/:id',updateUbicacionProveedor);
router.patch('/estado/:id', updateEstadoProveedor);
router.patch('/cs/:id',updateCSProveedor);
router.get('/inactivos',getAllProveedoresInactivos);
//ruta para asignar un usuario a un proveedor
router.post('/usuario/:id',createUserProveedor);
//ruta para actualizar la imagen de un proveedor
router.put('/updateimage/:id',UpdateImageProveedor);
module.exports = router;