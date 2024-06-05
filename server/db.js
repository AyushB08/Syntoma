const Pool = require("pg").Pool;
const pool = new Pool({ 
    user: "ayushbheemaiah",
    password: "ayush",
    host: "localhost",
    port: 4000,
    database: "project_v1"
})

module.exports = pool;