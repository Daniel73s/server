const dbconection = require('../db/dbconection');
const bcryptjs = require('bcrypt');
const { response, request } = require('express');

//funcion para agregar un nuevo usuario
const postUsuario = async (req = request, res = response) => {
    const { usuario, pass, id_rol } = req.body;
    let passhash = await bcryptjs.hash(pass, 8);
    const consulta = 'insert into usuarios(usuario,pass,id_rol) values ($1,$2,$3)  RETURNING usuario';
    try {
        const data = await dbconection.query(consulta, [usuario, passhash, id_rol]);
        res.json(data.rows[0])
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para actualizar el estado de la cuenta de usuario
const updateEstadoUsuario = async (req = request, res = response) => {
    const { usuario } = req.params;
    const { estado } = req.body;
    const consulta = 'update usuarios set estado=$1 where usuario=$2';
    try {
        await dbconection.query(consulta, [estado, usuario]);
        res.json({
            mensaje: 'Se actualizo correctamente'
        });
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//funcion para actualizar el estado de la cuenta de usuario
const updatePasswordAdmin = async (req = request, res = response) => {
    const { usuario, pass } = req.body;
    let passhash = await bcryptjs.hash(pass, 8);
    const consulta = 'update usuarios set pass=$1 where usuario=$2';
    try {
        await dbconection.query(consulta, [passhash, usuario]);
        res.json({
            mensaje: 'Se actualizo correctamente'
        });
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}



module.exports = {
    postUsuario,
    updateEstadoUsuario,
    updatePasswordAdmin
}