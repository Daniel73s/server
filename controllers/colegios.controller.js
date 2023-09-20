const pg = require('pg');
const {response,request}=require('express');
//configurando pg
const pool=new pg.Pool({
    connectionString:'postgres://fl0user:MKaA5RtcvHu7@ep-plain-frog-81092153.ap-southeast-1.aws.neon.tech:5432/taller?sslmode=require',
    ssl:true
})
//mostrar a todos los colegios
const getAllColegios = async(req=request, res=response) => {
   const result=await pool.query('select * from colegios');
    const {page=1,limit=10}=req.query;
    res.json(result.rows);
}

//crear nuevo colegio
const postColegio = (req, res=response) => {
    const {nombre}=req.body;
    res.json({
        resp: 'ok',
        msg: 'crear nuevo colegio',
        nombre
    });
}

//actualizar colegio
const patchColegio = (req, res=response) => {
    const {id}=req.params;
    res.json({
        resp: 'ok',
        msg: `Se actualizo el colegio con el id ${id}`
    });
}

//eliminar colegio
const deleteColegio = (req, res=response) => {
    res.json({
        resp: 'ok',
        msg: 'eliminar colegio'
    });
}

module.exports={
    getAllColegios,
    postColegio,
    patchColegio,
    deleteColegio
}