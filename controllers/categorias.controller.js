const dbconection = require('../db/dbconection');
const { response, request } = require('express');

//api para mostrar todas las categorias
const getAllCategorias = async (req = request, res = response) => {
    //creamos la consulta
    const consulta = 'select * from categorias';
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//api para mostrar todas las categorias
const getAllCategoriasValidas= async (req = request, res = response) => {
    //creamos la consulta
    const consulta = `select * from categorias where estado=true `;
    //ejecutamos la consulta dependiendo de la variable dbconection
    const response = await dbconection.query(consulta);
    //enviando la respouesta en formato json
    res.json(response.rows)
}

//api para crear una nueva categoria
const PostCategoria = async (req = request, res = response) => {
    const { nombre, descripcion } = req.body;
    const consulta = 'insert into categorias(nombre,descripcion) values ($1,$2)';
    try {
        await dbconection.query(consulta, [nombre.toUpperCase(), descripcion.toUpperCase()]);
        res.json({
            mensaje:"Se adiciono la categoria, correctamente."
        })
    } catch (error) {
        console.log(error.message);
        res.json({
            msg: "Ocurrio un error inesperado, intentelo mas tarde."
        });
    }
}

//llamar a una categoria segun su id
const getFindOneCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    console.log("llego ",id);
    const consulta = `select * from categorias where id_categoria=$1`
    const result = await dbconection.query(consulta, [id]);
    res.json(result.rows[0]);//enviando solo el primero 
}

//Actualiza la informacion de la categoria mediante su id (Falta terminar solo se hizo el metodo )
const UpdateCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    const consulta = `update categorias set nombre=$1, descripcion=$2 where id_categoria=$3`
    await dbconection.query(consulta, [nombre.toUpperCase(),descripcion.toUpperCase(),id]);
    res.json({
        "mensaje":"Se actualizo correctamente"
    });
}

// Funcion para habilitar y deshabilitar una categoria
const UpdateEstadoCategoria = async (req = request, res = response) => {
    const { id } = req.params;
    const { estado } = req.body;
    const consulta = `update categorias set estado=$1 where id_categoria=$2`
    await dbconection.query(consulta, [estado,id]);
    res.json({
        "mensaje":"Se actualizo correctamente"
    });
}


module.exports = {
    getAllCategorias,
    PostCategoria,
    getFindOneCategoria,
    UpdateCategoria,
    UpdateEstadoCategoria,
    getAllCategoriasValidas
}