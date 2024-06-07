const pool = require("./db");

const verifyTables = async () => {
  try {
    const usersTable = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
    const imagesTable = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'images'");

    console.log("Users table columns: ", usersTable.rows.map(row => row.column_name));
    console.log("Images table columns: ", imagesTable.rows.map(row => row.column_name));
    pool.end();
  } catch (err) {
    console.error(err.message);
    pool.end();
  }
};

verifyTables();
