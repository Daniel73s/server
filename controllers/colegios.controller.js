const pg = require('pg');
const { response, request } = require('express');
//configurando pg
// const pool=new pg.Pool({
//     connectionString:'postgres://fl0user:MKaA5RtcvHu7@ep-plain-frog-81092153.ap-southeast-1.aws.neon.tech:5432/taller?sslmode=require',
//     ssl:true
// });

const pool = new pg.Pool({
    user: 'postgres', // Reemplaza con tu nombre de usuario de PostgreSQL
    host: 'localhost',  // Reemplaza con la dirección de tu servidor PostgreSQL
    database: 'taller', // Reemplaza con el nombre de tu base de datos
    password: 'postgres', // Reemplaza con tu contraseña de PostgreSQL
    port: 5432 // Reemplaza con el puerto de tu servidor PostgreSQL (por defecto, es 5432)
});

//mostrar a todos los colegios
const getAllColegios = async (req = request, res = response) => {
    const query = `
    select c.id_colegio,c.rue,c.nombre,c.estudiantes,c.dependencia,c.nivel,c.estado,
    uc.calle,uc.numero,uc.ciudad,uc.zona,uc.area_geografica,uc.latitud, uc.longitud,
    cc.tel_fijo,cc.num_celular,cc.email,us.usuario,us.estado as estado_usuario
	from colegios c
	INNER JOIN 
	 ubicacion_colegio uc
	ON 
	 c.id_colegio=uc.id_colegio
	INNER JOIN 
	 contacto_colegio cc
	ON 
	 c.id_colegio=cc.id_colegio
	LEFT JOIN
	 usuarios us
	ON
	 c.usuario=us.usuario
	ORDER BY c.nombre ASC;		
    `
    const result = await pool.query(query);
    // const { page = 1, limit = 10 } = req.query;
    res.json(result.rows);
}

//seleccionar un solo colegio
const getFindOneColegio = async (req = request, res = response) => {
    const { id } = req.params;
    const query = `
   select c.id_colegio,c.rue,c.nombre,c.estudiantes,c.dependencia,c.nivel,c.estado,
    uc.calle,uc.numero,uc.ciudad,uc.zona,uc.area_geografica,uc.latitud, uc.longitud,
    cc.tel_fijo,cc.num_celular,cc.email,us.usuario,us.estado as estado_usuario,r.nombre as rol
    from colegios c
	INNER JOIN 
	 ubicacion_colegio uc
	ON 
	 c.id_colegio=uc.id_colegio
	INNER JOIN 
	 contacto_colegio cc
	ON 
	 c.id_colegio=cc.id_colegio
	LEFT JOIN
	 usuarios us
	ON
	 c.usuario=us.usuario
	LEFT JOIN
	 roles r
	ON
	 us.id_rol=r.id_rol
     where (c.id_colegio=$1)
    `
    const result = await pool.query(query, [id]);
    // const { page = 1, limit = 10 } = req.query;
    res.json(result.rows[0]);//enviando solo el primero 
}


////////////////////////////////////////////////////////////////
/////////////////////crear nuevo colegio///////////////////////
////////////////////////////////////////////////////////////////
const postColegio = async (req = request, res = response) => {
    //extrtayendo los tados del body
    const { rue, nombre, estudiantes, dependencia, niveles } = req.body;
    //consulta
    const query = `
       INSERT INTO colegios(rue, nombre, estudiantes, dependencia, nivel)
           VALUES ($1,$2, $3, $4, $5) RETURNING id_colegio;
    `;

    try {
        //Realizando la creacion del colegio
        const result = await pool.query(query, [
            rue,
            nombre.toUpperCase(),
            estudiantes,
            dependencia.toUpperCase(),
            niveles
        ]);
        res.json({
            id: result.rows[0].id_colegio
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
}

//Adicionando la ubicacion del colegio
const ubicacionColegio = async (req = request, res = response) => {
    //extrtayendo los tados del body
    const { id_colegio, calle, numero, ciudad, zona, ageografica, latitud, longitud } = req.body;
    //consulta
    const query = `
       INSERT INTO ubicacion_colegio(id_colegio,calle, numero, ciudad, zona,area_geografica,latitud,longitud)
           VALUES ($1,$2, $3, $4, $5, $6, $7, $8);
    `;

    try {
        //Realizando la creacion del colegio
        const result = await pool.query(query, [
            id_colegio,
            calle.toUpperCase(),
            numero,
            ciudad.toUpperCase(),
            zona.toUpperCase(),
            ageografica.toUpperCase(),
            latitud,
            longitud
        ]);
        res.json({
            result
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
}
// Adionando el contacto del colegio como ser telefono celular email
const contactoColegio = async (req = request, res = response) => {
    //extrtayendo los tados del body
    const { id_colegio, telefono, email, celular } = req.body;
    //consulta
    const query = `
       INSERT INTO contacto_colegio(id_colegio, tel_fijo,num_celular,email)
           VALUES ($1,$2, $3, $4);
    `;

    try {
        //Realizando la creacion del colegio
        await pool.query(query, [
            id_colegio,
            telefono,
            celular,
            email
        ]);
        res.json({
            msg: 'El colegio se creo correctamente'
        });
    } catch (error) {
        res.json({
            msg: error
        });
    }
}

////////////////////////////////////////////////////////////////
///////////////////// fin crear nuevo colegio///////////////////////
////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////
/////////////////////Actualizar colegio///////////////////////
////////////////////////////////////////////////////////////////
const updateColegio = async (req = request, res = response) => {
    //extrtayendo los tados del body
    const { id } = req.params;
    const { rue, nombre, estudiantes, dependencia, niveles } = req.body;
    //consulta
    const query = `
        UPDATE colegios
            SET rue = $1, nombre = $2, estudiantes = $3, dependencia = $4, nivel = $5
                WHERE id_colegio = $6 
                    RETURNING id_colegio
    `;

    const respuesta = await pool.query(query, [
        rue,
        nombre.toUpperCase(),
        estudiantes,
        dependencia.toUpperCase(),
        niveles,
        id
    ]);
    res.json({
        data: 'ok',
        message: 'Se actualizo correctamente',
        id: respuesta.rows[0].id_colegio
    });

}

//crear nuevo ubicacion del colegio
const updateUbicacion = async (req = request, res = response) => {
    //extrayendo el id del path
    const {id}=req.params;
    //extrtayendo los tados del body
    const { calle, numero, ciudad, zona, ageografica, latitud, longitud } = req.body;
    //consulta
    const query = `
        UPDATE ubicacion_colegio
            SET calle = $2, numero = $3, ciudad = $4, zona = $5, area_geografica = $6, latitud = $7, longitud = $8
                 WHERE id_colegio = $1
                    RETURNING id_colegio

    `;


    const result = await pool.query(query, [
        id,
        calle.toUpperCase(),
        numero,
        ciudad.toUpperCase(),
        zona.toUpperCase(),
        ageografica.toUpperCase(),
        latitud,
        longitud
    ]);

    res.json({
        message:'Se actualizo correctamente',
        id:result.rows[0].id_colegio
    });

}

const updateContacto = async (req = request, res = response) => {
    //extrayendo id del path
    const {id}=req.params;
    //extrtayendo los tados del body
    const { telefono, email, celular } = req.body;
    //consulta
    const query = `
        UPDATE contacto_colegio
            SET tel_fijo = $2, num_celular = $3, email = $4
                WHERE id_colegio = $1;
    `;
        await pool.query(query, [
            id,
            telefono,
            celular,
            email
        ]);
        res.json({
            message: 'Se actualizo correctamente'
        });

}

////////////////////////////////////////////////////////////////
///////////////////// fin actualizar colegio////////////////////
////////////////////////////////////////////////////////////////



//eliminar colegio
const deleteColegio = async (req = request, res = response) => {
    const { id } = req.params;
    const query = `update colegios set estado=false where id_colegio=$1;`;
    try {
        const result = await pool.query(query, [id]).then(() => {
            res.json({
                msg: 'Se dio de baja Correctamente',
                estado: 'ok'
            });
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Ocurrio un error inesperado',
            estado: 'error'
        });
    }
}

//Habilitar colegio
const habilitarColegio = async (req = request, res = response) => {
    const { id } = req.params;
    const query = `update colegios set estado=true where id_colegio=$1;`;
    try {
        const result = await pool.query(query, [id]).then(() => {
            res.json({
                msg: 'Se Habilito correctamente',
                estado: 'ok'
            });
        });
    } catch (error) {
        res.status(401).json({
            msg: 'Ocurrio un error inesperado',
            estado: 'error'
        });
    }
}

//funcion para asignar un usuario al colegio
const AgregarUserCol = async (req = request, res = response) => {
    const {id}=req.params;
    const { usuario } = req.body;
    const consulta = `update colegios set usuario=$1 where id_colegio=$2`;
    try {
        await pool.query(consulta, [usuario, id]);
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




module.exports = {
    getAllColegios,
    postColegio,
    deleteColegio,
    habilitarColegio,
    ubicacionColegio,
    contactoColegio,
    getFindOneColegio,
    updateColegio,
    updateUbicacion,
    updateContacto,
    AgregarUserCol 
}