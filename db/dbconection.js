//const pg = require('pg');
//configurando pg


const { Pool } = require('pg');
const pool=new Pool({
    connectionString:process.env.URL_POSTGRESQL_NEON,
    ssl:true
});

// const configBD = {
//     user: 'postgres',
//     password: 'postgres',
//     host: 'localhost',
//     database: 'taller',
//     port: 5432
// }

// const pool = new Pool(configBD);

module.exports = pool;