// const dbconection = require('../db/dbconection');
const cloudinary=require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)
const { response, request } = require('express');

//funcion para subir una imagen nueva 
const uploadImage = async (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({
        msg:'No se subio ninguna imagen.'
    });
    return;
  }
  const {tempFilePath}=req.files.archivo;
  const resp = await cloudinary.uploader.upload(tempFilePath);
   res.json({
    url_image:resp.secure_url
   });
}

//funcion para actualizar la imagen 
const updateImage = async (req = request, res = response) => {
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    res.status(400).json({
        msg:'No se subio ninguna imagen.'
    });
    return;
  }
  const { id } = req.params;
  cloudinary.uploader.destroy(id);
  const {tempFilePath}=req.files.archivo;
  const resp = await cloudinary.uploader.upload(tempFilePath)
   res.json({
    url_image:resp.secure_url
   });
}


module.exports = {
    uploadImage,
    updateImage
}


  // console.log('req.files >>>', req.files); // eslint-disable-line

  // const {archivo} = req.files;

  // uploadPath =path.join(__dirname ,'../uploads/' , archivo.name);
  // console.log(uploadPath,'este es el path');

  // archivo.mv(uploadPath,(err) =>{
  //   if (err) {
  //     return res.status(500).json({err});
  //   }

  //   res.json({
  //     msg:'El archivo se subio a: ' + uploadPath
  //   });
  // });

