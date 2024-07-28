const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT; //definiendo el puerto 

        // middelwares
        this.middelwares();
        //rutas de mi aplicacion
        this.routes();
    }

    //funcion para cargar las rutas
    routes() {
        this.app.use('/api/auth', require('../routes/auth.routes'));
        this.app.use('/api/colegios', require('../routes/colegios.routes'));
        this.app.use('/api/proveedores', require('../routes/proveedores.routes'));
        this.app.use('/api/categorias', require('../routes/categorias.routes'));
        this.app.use('/api/productos', require('../routes/productos.routes'));
        this.app.use('/api/uploads', require('../routes/uploads.routes'));
        this.app.use('/api/administradores', require('../routes/administradores.routes'));
        this.app.use('/api/usuarios', require('../routes/usuarios.routes'));
        this.app.use('/api/pedidos', require('../routes/pedidos.routes'));
        this.app.use('/api/reportes', require('../routes/reportes.routes'));
    }


    middelwares() {
        // configurando los cors
        this.app.use(cors());
        //lectura y parseo de datos del body
        this.app.use(express.json());
        // accediendo a la carpeta publica
        this.app.use(express.static('public'));
        //para manejar la carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/'
        }));
    }

    //funcion para escuchar el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log('server en el puerto ', this.port);
        });
    }



}

module.exports = Server;