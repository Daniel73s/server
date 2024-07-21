const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//funcion para mostrar todos los administradores
const getAllAdministradores= async (req = request, res = response) => {
    //creamos la consulta
    const consulta = ` 
    SELECT a.id_admin,a.nombre, a.ap, a.am, a.imagen, a.celular, a.ci, a.complemento, a.email, u.usuario, u.estado as estadousuario
	FROM 
    	administradores a
	LEFT JOIN 
    	usuarios u 
	ON 
    	a.usuario = u.usuario
    ORDER BY a.nombre ASC;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//funcion para agregar la ubicacion del administrador
const PostUbicacionAdministrador = async (req = request, res = response) => {
    const { zona, calle, referencia } = req.body;
    const consulta = `insert into ubicacion_administradores(zona,calle,referencia)
                      values ($1,$2,$3) RETURNING id_ubicacion`;
    try {
        const data=await dbconection.query(consulta, [zona.toUpperCase(), calle.toUpperCase(),referencia.toUpperCase()]);
        res.json(data.rows[0])
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para agregar un nuevo administrador
const PostAdministrador = async (req = request, res = response) => {
    const { nombre, ap,am,ci,complemento,email,celular,imagen,id_ubicacion } = req.body;
    const consulta = `insert into administradores(nombre,ap,am,ci,complemento,imagen,email,celular,id_ubicacion)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    try {
        await dbconection.query(consulta, [nombre.toUpperCase(), ap.toUpperCase(), am.toUpperCase(),ci,complemento,imagen,email,celular,id_ubicacion]);
        res.json({
            mensaje:"Se adiciono correctamente."
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para agregar un usuario al administrador
const AgregarUser = async (req = request, res = response) => {
    const {id}=req.params;
    const { usuario } = req.body;

    console.log('funcion agregar User ',id,usuario);
    const consulta = `update administradores set usuario=$1 where id_admin=$2`;
    try {
        await dbconection.query(consulta, [usuario, id]);
        res.json({
            mensaje:"Se actualizo correctamente"
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//FUNCION PARA SOLICITAR TODOS LOS DATOS DE UN SOLO ADMINISTRADOR
const getOneAdministrador= async (req = request, res = response) => {
    //capturando el id del administrador
    const {id}=req.params;
    //creamos la consulta
    const consulta = ` 
   	SELECT a.id_admin, a.nombre, a.ap, a.am, a.ci,a.email, a.complemento, a.imagen, a.celular, ubi.zona, ubi.calle, ubi.referencia, u.usuario, u.estado,r.nombre as rol
	FROM 
		administradores a
	INNER JOIN 
		ubicacion_administradores ubi 
	ON 
		a.id_ubicacion = ubi.id_ubicacion
	LEFT JOIN 
		usuarios u 
	ON 
		a.usuario = u.usuario
		
	LEFT JOIN 
		roles r
	ON 
		u.id_rol =r.id_rol
	WHERE 
		a.id_admin = $1;
    `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta,[id]);
    //enviando la respouesta en formato json
    res.json(response.rows[0])
}


module.exports = {
    getAllAdministradores,
    PostUbicacionAdministrador,
    PostAdministrador,
    AgregarUser,
    getOneAdministrador
}