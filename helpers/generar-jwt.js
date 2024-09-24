const jwt=require('jsonwebtoken');

const generarJWT=(data)=>{
    return new Promise((resolve,reject)=>{
            const payload={...data};
            jwt.sign(payload,'dasr*80889',{expiresIn:'1 days'},(error,token)=>{
                    if(error){
                        console.log(error);
                        reject('no se pudo generar el token');
                    }else{
                        resolve(token);
                    }
            });
    });
}

module.exports={
    generarJWT
}