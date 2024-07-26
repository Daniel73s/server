const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para mostrar todos los pedidos (fechas) de un colegio
const getAllPedidosByColegio = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_colegio } = req.params;
    //creamos la consulta
    const consulta = `
        select p.fecha_entrega, p.id_pedido, p.estado
   		from pedidos p, colegios col
		where col.id_colegio=p.id_colegio and col.id_colegio=$1
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta, [id_colegio]);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para mostrar pedido dependiendo el id del colegio y la fecha
const getPedidosByColegioAndFecha = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_colegio, fecha_entrega } = req.query;
    console.log('param1:', id_colegio);
    console.log('param2:', fecha_entrega);
    //creamos la consulta
    const consulta = `
       SELECT 
        p.id_pedido, 
        p.fecha_entrega, 
        p.estado, 
        prod.nombre AS producto, 
        prod.imagen AS imagen_producto,
        prod.id_producto, 
        dp.cantidad
       FROM 
        pedidos p
       INNER JOIN 
        colegios col 
       ON 
        col.id_colegio = p.id_colegio
       INNER JOIN 
        detalle_pedido dp 
       ON 
        dp.id_pedido = p.id_pedido
       INNER JOIN 
        productos prod 
       ON 
        dp.id_producto = prod.id_producto
       WHERE 
        col.id_colegio = $1 
        AND p.fecha_entrega = $2;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const data = await dbconection.query(consulta, [id_colegio, fecha_entrega]);
    //enviando la respouesta en formato json
    res.json(data.rows[0])
}

//funcion para mostrar los pedidos que tiene un proveedor en una determinada fecha
const getPedidosByProveedorAndFecha = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_proveedor, fecha_entrega } = req.query;
    //creamos la consulta
    const consulta = `
    SELECT p.id_pedido, 
       p.fecha_entrega, 
       p.estado, 
       dp.cantidad, 
       pr.razon_social AS proveedor, 
       pr.limite_entregas
    FROM pedidos p
    INNER JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
    INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
    WHERE pr.id_proveedor = $1 
        AND p.fecha_entrega = $2
        AND (p.estado = 'pendiente' OR p.estado = 'confirmado');
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const data = await dbconection.query(consulta, [id_proveedor, fecha_entrega]);
    //enviando la respouesta en formato json
    res.json(data.rows)
}

//funcion para adicionar un nuevo pedido
const postPedido = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_colegio, id_proveedor, fecha, hora_inicio, hora_fin } = req.body;
    console.log('llego pedido ', id_colegio, id_proveedor, fecha, hora_inicio, hora_fin);
    //creamos la consulta
    const consulta = `
      INSERT INTO pedidos (id_colegio, id_proveedor, fecha_entrega, hora_inicio, hora_fin)
	  VALUES ($1, $2, $3, $4, $5)
	  RETURNING id_pedido;
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        const data = await dbconection.query(consulta, [id_colegio, id_proveedor, fecha, hora_inicio, hora_fin]);
        //enviando la respouesta en formato json
        res.json(data.rows[0])
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al guardar el pedido'
        })
    }
}

//funcion para adicionar un nuevo pedido
const postDetallePedido = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_pedido, id_producto, cantidad } = req.body;
    console.log('llego detalle pedido ', id_pedido, id_producto, cantidad);
    //creamos la consulta
    const consulta = `
      INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad)
	  VALUES ($1,$2,$3)
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        await dbconection.query(consulta, [id_pedido, id_producto, cantidad]);
        //enviando la respouesta en formato json
        res.json({
            mensaje: 'Se adiciono correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al guardar el detalle del pedido'
        })
    }
}

//funcion para eliminar el detalle del pedido
const deleteDetallePedido = async (req = request, res = response) => {
    //obteniendo el id del pedido
    const { id_pedido } = req.params;
    console.log('eliminar detalle pedido ', id_pedido);
    //creamos la consulta
    const consulta = `
     	DELETE FROM detalle_pedido
        WHERE id_pedido = $1;
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        await dbconection.query(consulta, [id_pedido]);
        //enviando la respouesta en formato json
        res.json({
            mensaje: 'Se elimino correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al eliminar el detalle del pedido'
        })
    }
}

//funcion para eliminar el pedido
const deletePedido = async (req = request, res = response) => {
    //obteniendo el id del pedido
    const { id_pedido } = req.params;
    console.log('eliminar pedido ', id_pedido);
    //creamos la consulta
    const consulta = `
     	DELETE FROM pedidos
        WHERE id_pedido = $1;
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        await dbconection.query(consulta, [id_pedido]);
        //enviando la respouesta en formato json
        res.json({
            mensaje: 'Se elimino correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al eliminar el detalle del pedido'
        })
    }
}

//funcion para mostrar toda la informacion del pedido
const fullDetallePedido = async (req = request, res = response) => {
    //obteniendo el id del pedido
    const { id_pedido } = req.params;
    console.log('mostrar la informacion del pedido ', id_pedido);
    //creamos la consulta
    const consulta = `
            SELECT 
            p.id_pedido, 
            p.fecha_entrega, 
            p.fecha_creacion,
            p.estado as estado_pedido, 
            p.hora_inicio,
            p.hora_fin,
            prod.nombre AS producto, 
            prod.imagen AS imagen_producto,
            prod.id_producto, 
            prod.precio_unitario,
            col.nombre as colegio,
            col.estudiantes,
            col.id_colegio,
            colUbi.latitud,
            colUbi.longitud,
            colUbi.zona as zona_colegio,
            colUbi.calle as calle_colegio,
            colContact.tel_fijo as telefono_colegio,
            colContact.num_celular as celular_colegio,
            prov.razon_social as proveedor,
            prov.imagen as imagen_proveedor,
            prov.id_proveedor,
            prov.celular as celular_proveedor,
            prov_ubi.zona as zona_proveedor,
            prov_ubi.calle as calle_proveedor,
            prov_ubi.referencia as referencia_proveedor,
            dp.cantidad
            FROM 
            pedidos p
            INNER JOIN 
            colegios col 
            ON 
            col.id_colegio = p.id_colegio
            INNER JOIN 
            detalle_pedido dp 
            ON 
            dp.id_pedido = p.id_pedido
            INNER JOIN 
            productos prod 
            ON 
            dp.id_producto = prod.id_producto
            INNER JOIN 
            ubicacion_colegio colUbi
            ON 
            colUbi.id_colegio=col.id_colegio
            INNER JOIN 
            contacto_colegio colContact
            ON 
            colContact.id_colegio=col.id_colegio
            INNER JOIN 
            proveedores prov 
            ON 
            prov.id_proveedor=p.id_proveedor
            INNER JOIN 
            ubicacion_proveedor prov_ubi 
            ON 
            prov_ubi.id_proveedor=prov.id_proveedor
            WHERE 
            p.id_pedido = $1
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        const data = await dbconection.query(consulta, [id_pedido]);
        //enviando la respouesta en formato json
        res.json(data.rows[0])
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al momento de consultar sobre los datos del pedido '
        })
    }
}

//funcion para mostrar los pedidos de un proveedor
const getPedidosByProveedor = async (req = request, res = response) => {
    //obteniendo el id del colegio
    const { id_proveedor } = req.params;
    //creamos la consulta
    const consulta = `
            SELECT p.id_pedido, 
            p.fecha_entrega, 
            p.estado, 
			p.hora_inicio,
			p.hora_fin,
            dp.cantidad, 
            pr.razon_social AS proveedor,
            pr.id_proveedor,
			col.nombre as colegio,
			colubi.zona as zona_colegio,
			colubi.calle as calle_colegio,
			pro.nombre as producto,
			pro.precio_unitario
            FROM pedidos p
            INNER JOIN proveedores pr ON pr.id_proveedor = p.id_proveedor
            INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
			INNER JOIN colegios col ON col.id_colegio = p.id_colegio
			INNER JOIN ubicacion_colegio colubi ON col.id_colegio = colubi.id_colegio
			INNER JOIN productos pro ON pro.id_producto = dp.id_producto
            WHERE pr.id_proveedor = $1
            ORDER BY p.fecha_entrega ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const data = await dbconection.query(consulta, [id_proveedor]);
    //enviando la respouesta en formato json
    res.json(data.rows)
}

//modificar el estado del pedido
const modificarEstadoPedido = async (req = request, res = response) => {
    //obteniendo el id del pedido
    const { id_pedido } = req.params;
    const {estado}=req.body;
    //creamos la consulta
    const consulta = `
     		UPDATE pedidos
	        SET estado = $1
	        WHERE id_pedido = $2;
    `;
    try {
        //ejecutamos la consulta dependiendo de la variable dbconection
        await dbconection.query(consulta, [estado,id_pedido]);
        //enviando la respouesta en formato json
        res.json({
            mensaje: 'Se modifico correctamente'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            mensaje: 'Ocurrio un error al cambiar el estado del pedido'
        })
    }
}

module.exports = {
    getAllPedidosByColegio,
    getPedidosByColegioAndFecha,
    getPedidosByProveedorAndFecha,
    postPedido,
    postDetallePedido,
    deletePedido,
    deleteDetallePedido,
    fullDetallePedido,
    getPedidosByProveedor,
    modificarEstadoPedido
}