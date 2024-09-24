const { Router } = require('express');
const { getAllProductos, 
    UpdateEstadoProducto, 
    getOneProducto, 
    UpdateImageProducto, 
    updateProducto, 
    createProducto,
    asignarProducto,
    detalleProducto,
    getProductosCategoria,
    getAllProductosActivos,
    depurarProductos} = require('../controllers/productos.controller');

const router = Router();
//solicitar informacion de todas los productos
router.get('/', getAllProductos);
//obtener productos activos
router.get('/activos', getAllProductosActivos);
//solicitar toda la informacion de un producto para ponerlo en detalles
router.get('/detalle/:id',detalleProducto);
//obtener todos los productos de una categoria
router.get('/producto_categoria/:id',getProductosCategoria);
//solitar la informacion de un solo producto
router.get('/:id', getOneProducto);

//crear producto 
router.post('/',createProducto);
//asignar el nuevo producto a un proveedor
router.post('/asignar',asignarProducto);
//depurar productos 
router.patch('/depurar',depurarProductos);
//actualizar informacion acerca del producto
router.patch('/:id',updateProducto);
//actualizar el estado del producto
router.patch('/estado/:id', UpdateEstadoProducto);
//actualizar la imagen del producto
router.patch('/imagen/:id', UpdateImageProducto);


module.exports = router;