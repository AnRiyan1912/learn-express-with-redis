const db = require("../postgres.config");
const createTableUsers = () => {
  return db.pool.query(
    "CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"
  );
};

module.exports = { createTableUsers };
