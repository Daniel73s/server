const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para mostrar todas los proveedores
const getAllProveedores = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = `
    	select 
		 p.id_proveedor,p.nit,p.razon_social,p.celular,p.fecha_creacion,p.imagen,
		 p.certificado_sanitario,p.estado,p.limite_entregas, u.zona, 
		 u.calle, u.referencia,us.usuario,us.estado as estado_usuario
	    from
		 proveedores p
		INNER JOIN 
		 ubicacion_proveedor u
		ON
		 p.id_proveedor=u.id_proveedor
		LEFT JOIN
		 usuarios us
		ON 
		 p.usuario=us.usuario
        ORDER BY p.razon_social ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}
//funcion para mostrar todas los proveedores
const getAllProveedoresActivos = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = `
    	select 
		 p.id_proveedor,p.nit,p.razon_social,p.celular,p.fecha_creacion,p.imagen,
		 p.certificado_sanitario,p.estado,p.limite_entregas, u.zona, u.calle, u.referencia
	    from
		 proveedores p, ubicacion_proveedor u
	    where 
		 (p.id_proveedor=u.id_proveedor) and (p.estado='activo')
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}


const getAllProveedoresInactivos = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = `
    	select 
		 p.id_proveedor,p.nit,p.razon_social,p.celular,p.fecha_creacion,p.imagen,
		 p.certificado_sanitario,p.estado,p.limite_entregas, u.zona, u.calle, u.referencia
	    from
		 proveedores p, ubicacion_proveedor u
	    where 
		 (p.id_proveedor=u.id_proveedor) and (p.estado='inactivo')
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para retornar un solo proveedor segun su id
const getOneProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const consulta = `
    	 select 
		 p.id_proveedor,p.nit,p.razon_social,p.celular,p.fecha_creacion,p.imagen,
		 p.certificado_sanitario,p.estado,p.limite_entregas, u.zona, u.calle, 
		 u.referencia,us.usuario,us.estado as estado_usuario, r.nombre as rol
	    from
		 proveedores p
		INNER JOIN 
		 ubicacion_proveedor u
		ON
		 p.id_proveedor=u.id_proveedor
		LEFT JOIN
		 usuarios us
		ON 
		 p.usuario=us.usuario
		LEFT JOIN
		 roles r
		ON
		 us.id_rol=r.id_rol
	    where 
		 (p.id_proveedor=$1)
    `;
    try {
        const response = await dbconection.query(consulta, [id]);
        console.log('este es el resultado',response.rows[0]);
        res.json(response.rows[0])
    } catch (error) {
        console.log(error.message);
    }
    //ejecutamos la consulta dependiendo de la variable dbconection
    //enviando la respouesta en formato json
}

//funcion para crear un nuevo proveedor
const createProveedor = async (req = request, res = response) => {
    const { nit, razon_social, celular, certificado_sanitario, limite_entregas, imagen } = req.body;
    const consulta = `
     INSERT INTO proveedores 
     (nit, razon_social, celular, certificado_sanitario, limite_entregas,imagen)
     VALUES ($1, $2, $3, $4, $5,$6)
     RETURNING id_proveedor
     `;
    try {
        const data = await dbconection.query(consulta, [nit, razon_social.toUpperCase(), celular, certificado_sanitario, limite_entregas, imagen]);
        res.json(data.rows[0])
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para crear una nueva ubicacion de proveedor
const createUbicacionProveedor = async (req = request, res = response) => {
    const { id_proveedor, zona, calle, referencia } = req.body;
    const consulta = `
     INSERT INTO ubicacion_proveedor
     (id_proveedor,zona,calle,referencia)
     VALUES ($1, $2, $3, $4)
     `;
    try {
        await dbconection.query(consulta, [id_proveedor, zona.toUpperCase(), calle.toUpperCase(), referencia.toUpperCase()]);
        res.json({
            mensaje: "Se adiciono correctamente"
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para actualizar el estado del proveedor
const updateEstadoProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado } = req.body;
    const consulta = `update proveedores set estado=$1 where id_proveedor=$2`
    if (estado === 'activo' || estado === 'inactivo') {
        try {
            await dbconection.query(consulta, [estado, id]);
            res.json({
                mensaje: "Se actualizo correctamente"
            });
        } catch (error) {
            console.log(error.message);
            res.json({
                "mensaje": "Ocurrio un error inesperado"
            });
        }
    } else {
        res.json({
            "mensaje": "estado invalido"
        });
    }
}

//funcion para actualizar el Certificado sanitario del proveedor
const updateCSProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { certificado_sanitario } = req.body;
    const consulta = `update proveedores set certificado_sanitario=$1 where id_proveedor=$2`
    if (certificado_sanitario === 'valido' || certificado_sanitario === 'pendiente') {
        try {
            await dbconection.query(consulta, [certificado_sanitario, id]);
            res.json({
                mensaje: "Se actualizo correctamente"
            });
        } catch (error) {
            console.log(error.message);
            res.json({
                "mensaje": "Ocurrio un error inesperado"
            });
        }
    } else {
        res.json({
            "mensaje": "no valido"
        });
    }
}

// funcion para actualizar informacion sobre el proveedor
const updateProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { razon_social, nit, limite_entregas, certificado_sanitario, celular } = req.body;
    const consulta = `update proveedores 
                      set razon_social=$1, nit=$2, 
                      limite_entregas=$3,certificado_sanitario=$4,celular=$5 
                      where id_proveedor=$6`
    try {
        await dbconection.query(consulta, [razon_social.toUpperCase(), nit, limite_entregas, certificado_sanitario, celular, id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}

// funcion para actualizar la ubicaicon del proveedor
const updateUbicacionProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { zona, calle, referencia } = req.body;
    const consulta = `update ubicacion_proveedor 
                      set zona=$1, calle=$2, 
                      referencia=$3
                      where id_proveedor=$4`
    try {
        await dbconection.query(consulta, [zona.toUpperCase(), calle.toUpperCase(), referencia.toUpperCase(), id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}

//funcion para asignar un usuario al proveedor
const createUserProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { usuario } = req.body;
    const consulta = `update proveedores set usuario=$1 where id_proveedor=$2`;
    try {
        await dbconection.query(consulta, [usuario, id]);
        res.json({
            mensaje: "Se actualizo correctamente"
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

// Funcion para actualizar la imagen de un proveedor
const UpdateImageProveedor = async (req = request, res = response) => {
    const { id } = req.params;
    const { url } = req.body;
    console.log('llego', id, url);
    const consulta = `update proveedores set imagen=$1 where id_proveedor=$2`;
    try {
        await dbconection.query(consulta, [url, id]);
        res.json({
            "mensaje": "Se actualizo correctamente"
        });
    } catch (error) {
        console.log(error.message);
    }
}

//funcion para saber que productos activos que tiene un proveedor
const productosProveedor = async (req = request, res = respomse) => {
    const { id } = req.params;
    const consulta = `
    SELECT p.id_producto, p.nombre, p.precio_unitario, p.imagen, pro.razon_social, pro.id_proveedor
	FROM productos p
	INNER JOIN 
	  producto_proveedor pp 
	ON 
	  p.id_producto = pp.id_producto
	INNER JOIN 
	  proveedores pro 
	ON 
	  pp.id_proveedor = pro.id_proveedor
	  
	WHERE pro.id_proveedor = $1 and p.estado='activo'
    `;
    try {
        const data=await dbconection.query(consulta, [id]);
        res.json(data.rows);
    } catch (error) {
        console.log(error.message);
    }
}

//funcion para saber que productos tiene un proveedor
const AllProductosProveedor = async (req = request, res = respomse) => {
    const { id } = req.params;
    const consulta = `
    SELECT p.id_producto, p.nombre, p.precio_unitario, p.imagen,p.estado, pro.razon_social, pro.id_proveedor
	FROM productos p
	INNER JOIN 
	  producto_proveedor pp 
	ON 
	  p.id_producto = pp.id_producto
	INNER JOIN 
	  proveedores pro 
	ON 
	  pp.id_proveedor = pro.id_proveedor
	  
	WHERE pro.id_proveedor = $1
    `;
    try {
        const data=await dbconection.query(consulta, [id]);
        res.json(data.rows);
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getAllProveedores,
    createProveedor,
    createUbicacionProveedor,
    updateEstadoProveedor,
    updateCSProveedor,
    getOneProveedor,
    updateProveedor,
    updateUbicacionProveedor,
    getAllProveedoresActivos,
    getAllProveedoresInactivos,
    createUserProveedor,
    UpdateImageProveedor,
    productosProveedor,
    AllProductosProveedor
}