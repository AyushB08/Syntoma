const { Pool } = require("pg");

const connectionString = "postgresql://project-db_owner:wjERJ9H7KrkL@ep-calm-sun-a5j81tua.us-east-2.aws.neon.tech/project-db?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
