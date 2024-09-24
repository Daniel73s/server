const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para sacar el reporte de los pedidos de un proveedor en un determinado mes
const getPedidosProveedorByMonth = async (req = request, res = response) => {
    const { id_proveedor } = req.params;
    const { anio, mes, estado } = req.query;
    //creamos la consulta
    const consulta = `
    SELECT p.id_pedido, p.fecha_creacion,p.fecha_entrega,p.estado,col.id_colegio,col.nombre as colegio,dp.cantidad,
		   pr.nombre as producto, pr.precio_unitario
	FROM pedidos p
	INNER JOIN 
	colegios col
	ON
	col.id_colegio=p.id_colegio
	INNER JOIN 
	detalle_pedido dp
	ON
	dp.id_pedido=p.id_pedido
	INNER JOIN
	productos pr
	ON
     pr.id_producto=dp.id_producto
	WHERE 
    EXTRACT(YEAR FROM p.fecha_entrega) = $1
    AND EXTRACT(MONTH FROM p.fecha_entrega) = $2
    AND (p.estado = $3 OR $3 = 'general')
	AND p.id_proveedor=$4
    ORDER BY p.fecha_entrega ASC
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta, [Number(anio), Number(mes), estado, id_proveedor]);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para sacar el reporte de pedidos de un proveedor por fecha especifica 
const getPedidosProveedorByDate = async (req = request, res = response) => {
    const { id_proveedor } = req.params;
    const { fecha_entrega, estado } = req.query;
    //creamos la consulta
    const consulta = `
    SELECT p.id_pedido, p.fecha_creacion,p.hora_inicio,p.hora_fin, p.fecha_entrega, p.estado, col.id_colegio, col.nombre as colegio, dp.cantidad,
       pr.nombre as producto, pr.precio_unitario,col_ubi.latitud, col_ubi.longitud
	FROM pedidos p
	INNER JOIN colegios col ON col.id_colegio = p.id_colegio
    INNER JOIN ubicacion_colegio col_ubi ON col.id_colegio = col_ubi.id_colegio
	INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
	INNER JOIN productos pr ON pr.id_producto = dp.id_producto
	WHERE p.fecha_entrega = $1
  	AND p.estado =$2
  	AND p.id_proveedor = $3;
    `;

    const consulta2 = `
    SELECT p.id_pedido, p.fecha_creacion, p.fecha_entrega, p.estado, col.id_colegio, col.nombre as colegio, dp.cantidad,
       pr.nombre as producto, pr.precio_unitario
	FROM pedidos p
	INNER JOIN colegios col ON col.id_colegio = p.id_colegio
	INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
	INNER JOIN productos pr ON pr.id_producto = dp.id_producto
	WHERE p.fecha_entrega = $1
  	AND p.id_proveedor = $2;
    `;

    let = data = '';
    if (estado == 'general') {
        //ejecutamos la consulta dependiendo de la variable dbconection
        data = await dbconection.query(consulta2, [fecha_entrega, id_proveedor]);
    } else {
        //ejecutamos la consulta dependiendo de la variable dbconection
        data = await dbconection.query(consulta, [fecha_entrega, estado, id_proveedor]);
    }
    //enviando la respouesta en formato json
    res.json(data.rows)
}

//funcion para sacar el reporte de los pedidos de un colegio en un determinado mes
const getPedidosColegioByMonth = async (req = request, res = response) => {
    const { id_colegio } = req.params;
    const { anio, mes,estado } = req.query;
    //creamos la consulta
    const consulta = `
    SELECT p.id_pedido, p.fecha_creacion,p.fecha_entrega,p.estado,prov.razon_social as proveedor,
	prov.id_proveedor,dp.cantidad,pr.nombre as producto, pr.precio_unitario
	FROM pedidos p
	INNER JOIN
	proveedores prov
	ON
	prov.id_proveedor=p.id_proveedor
	INNER JOIN 
	detalle_pedido dp
	ON
	dp.id_pedido=p.id_pedido
	INNER JOIN
	productos pr
	ON
     pr.id_producto=dp.id_producto
	WHERE 
    EXTRACT(YEAR FROM p.fecha_entrega) = $1
    AND EXTRACT(MONTH FROM p.fecha_entrega) = $2
    AND (p.estado = $3 OR $3 = 'general')
	AND p.id_colegio=$4
    ORDER BY p.fecha_entrega ASC
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta, [anio, mes,estado ,id_colegio]);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para sacar el reporte de los pedidos de un colegio en un determinado mes
const inicio = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = `
        SELECT 'administradores' AS tabla, COUNT(*) AS total FROM administradores
        UNION ALL
        SELECT 'colegios', COUNT(*) FROM colegios
        UNION ALL
        SELECT 'productos', COUNT(*) FROM productos
        UNION ALL
        SELECT 'proveedores', COUNT(*) FROM proveedores;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para generar un reporte entre fechas
const getPedidosProveedorByFechas = async (req = request, res = response) => {
    const { id_proveedor } = req.params;
    const { inicio,fin, estado } = req.query;
    //creamos la consulta
    const consulta = `
        SELECT p.id_pedido, p.fecha_creacion, p.fecha_entrega, p.estado, col.id_colegio, col.nombre as colegio, dp.cantidad,
            pr.nombre as producto, pr.precio_unitario
        FROM pedidos p
        INNER JOIN colegios col ON col.id_colegio = p.id_colegio
        INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
        INNER JOIN productos pr ON pr.id_producto = dp.id_producto
        WHERE p.fecha_entrega BETWEEN $1 AND $2
        AND p.estado = $3
        AND p.id_proveedor = $4
        ORDER BY p.fecha_entrega ASC
    `;

    const consulta2 = `
        SELECT p.id_pedido, p.fecha_creacion, p.fecha_entrega, p.estado, col.id_colegio, col.nombre as colegio, dp.cantidad,
                pr.nombre as producto, pr.precio_unitario
            FROM pedidos p
            INNER JOIN colegios col ON col.id_colegio = p.id_colegio
            INNER JOIN detalle_pedido dp ON dp.id_pedido = p.id_pedido
            INNER JOIN productos pr ON pr.id_producto = dp.id_producto
            WHERE p.fecha_entrega BETWEEN $1 AND $2
            AND p.id_proveedor = $3
            ORDER BY p.fecha_entrega ASC
    `;

    let = data = '';
    if (estado == 'general') {
        //ejecutamos la consulta dependiendo de la variable dbconection
        data = await dbconection.query(consulta2, [inicio,fin,id_proveedor]);
    } else {
        //ejecutamos la consulta dependiendo de la variable dbconection
        data = await dbconection.query(consulta, [inicio,fin, estado, id_proveedor]);
    }
    //enviando la respouesta en formato json
    res.json(data.rows)
}

module.exports = {
    getPedidosProveedorByMonth,
    getPedidosProveedorByDate,
    getPedidosColegioByMonth,
    inicio,
    getPedidosProveedorByFechas
}