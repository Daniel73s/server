// paquete de node propiamente

// paquete de terceros 
require('dotenv').config();
// paquetes creados personalmente
const Server = require('./models/server');

const server=new Server();
server.listen();