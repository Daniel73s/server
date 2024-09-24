const { request, response } = require('express');
const jwt=require('jsonwebtoken');
const validarJWT=(req=request,res=response,next)=>{
    const token =req.header('x-token');
    if (!token) {
        return res.status(401).json({
            mensaje:'no hay token en la peticion'
        });
    }
    try {
        jwt.verify(token,'dasr*80889');
        next();
    } catch (error) {
        console.log(error);
       res.status(401).json({
            mensaje:'token no valido'
        });
    }
}

module.exports={
    validarJWT
}