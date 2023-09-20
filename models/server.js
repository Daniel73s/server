const express = require('express');
const  cors = require('cors');
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
       this.app.use('/api/colegios',require('../routes/colegios.routes'));
    }


    middelwares() {
        // configurando los cors
        this.app.use(cors());
        //lectura y parseo de datos del body
        this.app.use(express.json());
        // accediendo a la carpeta publica
        this.app.use(express.static('public'));
    }

    //funcion para escuchar el servidor
    listen() {
        this.app.listen(this.port, () => {
            console.log('server en el puerto ', this.port);
        });
    }



}

module.exports = Server;