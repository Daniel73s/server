const dbconection = require('../db/dbconection');
const bcryptjs = require('bcrypt');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');

//api para la autenticacion del usuario
const loginApp = async (req = request, res = response) => {
    //creamos la consulta
    const { usuario, pass } = req.body;
    try {
        const consulta1 = `
        	SELECT COUNT(*) 
	        FROM usuarios 
	        WHERE usuario = $1 and estado='activo';
        `
        const consulta2 = `select pass from usuarios where usuario=$1`
        const consulta3 = `
  	        select r.nombre as rol
	        from usuarios u, roles r
	        where r.id_rol=u.id_rol and u.usuario=$1
            `
        const consulta4 = `
  	        select p.id_proveedor,p.razon_social as proveedor, r.nombre as rol
	        from proveedores p, usuarios u, roles r
	        where p.usuario=u.usuario and u.id_rol=r.id_rol and u.usuario=$1
            `

        const consulta5 = `
        	select c.id_colegio,c.nombre as colegio, r.nombre as rol
	        from colegios c, usuarios u, roles r
	        where c.usuario=u.usuario and u.id_rol=r.id_rol and u.usuario=$1
          `
        //validar si el email existe
        const emailexist = await dbconection.query(consulta1, [usuario]);
        if (emailexist.rows[0].count <= 0) {
            console.log('usuario no existe o esta dado de baja');
            return res.status(400).json({
                mensaje: 'usuario no existe o inhabilitado'
            });
        }
        const passuser = await dbconection.query(consulta2, [usuario]);
        const validPass = bcryptjs.compareSync(pass, passuser.rows[0].pass);
        //validar si el password existe 
        if (!validPass) {
            return res.status(400).json({
                mensaje: 'Password incorrecto'
            });
        }
        const data = await dbconection.query(consulta3, [usuario]);
        const { rol } = data.rows[0];
        let token='';
        let id='';
        if (rol == 'PROVEEDOR') {
            const datapro = await dbconection.query(consulta4,[usuario]);
            const {id_proveedor,proveedor,rol}=datapro.rows[0];
            token = await generarJWT({ id_proveedor,proveedor,rol });
            id=id_proveedor;
        }else{
            const datacol = await dbconection.query(consulta5,[usuario]);
            const {id_colegio,colegio,rol}=datacol.rows[0];
            token = await generarJWT({ id_colegio,colegio,rol });
            id=id_colegio;
        }
        res.json({
            token,
            rol,
            id
        })

        //generar el jwt
    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensaje: 'Ocurrio un error inesperado' })
    }
}



module.exports = {
    loginApp

}