const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para sacar el reporte de los pedidos de un proveedor en un determinado mes
const getPedidosProveedorByMonth = async (req = request, res = response) => {
    const {id_proveedor}=req.params;
    const {anio,mes,estado}=req.query;
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
    AND p.estado = $3
	AND p.id_proveedor=$4
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta,[Number(anio),Number(mes),estado,id_proveedor]);
    //enviando la respouesta en formato json
    res.json(response.rows)
}


module.exports = {
    getPedidosProveedorByMonth
}