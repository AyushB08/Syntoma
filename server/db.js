const { Pool } = require("pg");

const connectionString = "postgresql://projectdb_owner:o1b8hwKcJxgj@ep-little-dew-a5z96kx3.us-east-2.aws.neon.tech/projectdb?sslmode=require";

const pool = new Pool({
    connectionString: connectionString,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
