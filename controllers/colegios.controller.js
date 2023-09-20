const {response,request}=require('express');
//mostrar a todos los colegios
const getAllColegios = (req=request, res=response) => {
    const {page=1,limit=10}=req.query;
    res.json({
        resp: 'ok',
        msg: 'mostrar todos los colegios',
        page,
        limit
    });
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