const pool = require("./db");

const createTables = async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reports (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        fileurl VARCHAR(255) UNIQUE NOT NULL,
        modeltype VARCHAR(50) NOT NULL,
        confidence_1 DECIMAL(5,4),
        confidence_2 DECIMAL(5,4),
        confidence_3 DECIMAL(5,4),
        confidence_4 DECIMAL(5,4),
        confidence_5 DECIMAL(5,4),
        confidence_6 DECIMAL(5,4),
        confidence_7 DECIMAL(5,4),
        confidence_8 DECIMAL(5,4),
        confidence_9 DECIMAL(5,4),
        confidence_10 DECIMAL(5,4),
        confidence_11 DECIMAL(5,4),
        confidence_12 DECIMAL(5,4),
        confidence_13 DECIMAL(5,4),
        confidence_14 DECIMAL(5,4),
        confidence_15 DECIMAL(5,4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    
    `);
    
      

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        fileurl VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("tables create");

    

    pool.end();
  } catch (err) {
    console.error(err.message);
    pool.end();
  }
};

createTables();
