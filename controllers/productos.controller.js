const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para mostrar todos los productos y a quien pertenecen
const getAllProductos = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = ` 
    select p.id_producto,p.nombre,p.imagen, p.descripcion, p.tipo, p.medida, p.unidad_medida, p.precio_unitario,p.estado,
		   pr.razon_social,pr.id_proveedor
	from productos p,proveedores pr,producto_proveedor pp
	where p.id_producto=pp.id_producto and pr.id_proveedor=pp.id_proveedor
    ORDER BY p.nombre ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para mostrar todos los productos activos
const getAllProductosActivos = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = ` 
    select p.id_producto,p.nombre,p.imagen, p.descripcion, p.tipo, p.medida, p.unidad_medida, p.precio_unitario,p.estado,
		   pr.razon_social,pr.id_proveedor
	from productos p,proveedores pr,producto_proveedor pp
	where p.id_producto=pp.id_producto and pr.id_proveedor=pp.id_proveedor and p.estado='activo'
    ORDER BY p.nombre ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para crear un nuevo producto
const createProducto = async (req = request, res = response) => {
    const { nombre, precio_unitario, tipo, medida, unidad_medida, descripcion, id_categoria, imagen,estado } = req.body;
    // console.log('llego',nombre,precio_unitario, tipo, medida, unidad_medida, descripcion,id_categoria,imagen);
   const consulta = `insert into productos(nombre, precio_unitario, tipo, medida,unidad_medida, descripcion, id_categoria,imagen,estado)
     VALUES ($1, $2, $3, $4, $5, $6, $7,$8,$9) RETURNING id_producto`;
    try {
        const data = await dbconection.query(consulta, [nombre.toUpperCase(), precio_unitario, tipo, medida, unidad_medida, descripcion.toUpperCase(), id_categoria, imagen,estado]);
        res.json(
            data.rows[0]
        );
    } catch (error) {
        console.log('este es el mensaje del crear producto', error);
    }
}

//funcion para asignar el producto que se acaba de crear a un proveedor
const asignarProducto = async (req = request, res = response) => {
    const { id_producto, id_proveedor } = req.body;
    const consulta = `
    INSERT INTO producto_proveedor (id_producto,id_proveedor)
     VALUES ($1, $2);
    `;
    try {
        await dbconection.query(consulta, [id_producto, id_proveedor]);
        res.json({
            mensaje: 'Se Guardo correctamente'
        });
    } catch (error) {
        console.log('este es el mensaje de asignar producto', error.message);
    }
}

// Funcion para habilitar y deshabilitar un producto
const UpdateEstadoProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado } = req.body;
    const consulta = `update productos set estado=$1 where id_producto=$2`;
    try {
        await dbconection.query(consulta, [estado, id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}
//funcion para los datos de un solo producto mediante el id
const getOneProducto = async (req = request, res = response) => {
    const { id } = req.params;
    // console.log("llego ",id);
    const consulta = `
    	select * from productos where id_producto=$1
    `;
    try {
        const response = await dbconection.query(consulta, [id]);
        res.json(response.rows[0])
    } catch (error) {
        console.log(error);
    }
}

// Funcion para actualizar la imagen de un producto
const UpdateImageProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { url } = req.body;
    const consulta = `update productos set imagen=$1 where id_producto=$2`;
    try {
        await dbconection.query(consulta, [url, id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}
//Funacion para actualizar el producto 
const updateProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre, precio_unitario, tipo, medida, unidad_medida, descripcion, id_categoria } = req.body;
    const consulta = `update productos set nombre=$1,
                      precio_unitario=$2, tipo=$3,
                      medida=$4,unidad_medida=$5,descripcion=$6,
                      id_categoria=$7 where id_producto=$8`;
    try {
        await dbconection.query(consulta, [nombre.toUpperCase(), precio_unitario, tipo, medida, unidad_medida, descripcion.toUpperCase(), id_categoria, id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}


//funcion para los detalles del producto

const detalleProducto = async (req = request, res = response) => {
    const { id } = req.params;
    const consulta = `
	select p.id_producto, p.nombre,p.imagen, 
	p.descripcion,p.tipo,p.medida,p.unidad_medida,
	p.precio_unitario,p.estado, c.nombre as categoria, pr.razon_social as proveedor,pr.limite_entregas,pr.id_proveedor,pr.imagen as imagen_proveedor
	from productos p, categorias c,proveedores pr, producto_proveedor pp
	where c.id_categoria=p.id_categoria and 
	p.id_producto=$1 and pr.id_proveedor=pp.id_proveedor 
	and p.id_producto=pp.id_producto
`;
    try {
        const response = await dbconection.query(consulta, [id]);
        res.json(response.rows[0])
    } catch (error) {
        console.log(error);
    }
}



//funcion para mostrar todos los productos que pertenecen a una categoria
const getProductosCategoria = async (req = request, res = response) => {
    //obtenemos el id
    const { id } = req.params;
    //creamos la consulta
    const consulta = ` 
    select * 
	from productos
	where id_categoria=$1 and estado='activo'
    ORDER BY nombre ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta, [id]);
    //enviando la respouesta en formato json
    res.json(response.rows)
}


module.exports = {
    getAllProductos,
    UpdateEstadoProducto,
    getOneProducto,
    UpdateImageProducto,
    updateProducto,
    createProducto,
    asignarProducto,
    detalleProducto,
    getProductosCategoria,
    getAllProductosActivos
}