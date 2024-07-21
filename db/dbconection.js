const pg = require('pg');
//configurando pg
// const pool=new pg.Pool({
//     connectionString:'postgres://fl0user:MKaA5RtcvHu7@ep-plain-frog-81092153.ap-southeast-1.aws.neon.tech:5432/taller?sslmode=require',
//     ssl:true
// });

const {Pool} = require('pg');

const configBD = {
    user:'postgres',
    password:'postgres',
    host:'localhost',
    database:'taller',
    port:5432
 }

const pool = new Pool(configBD);

module.exports = pool;