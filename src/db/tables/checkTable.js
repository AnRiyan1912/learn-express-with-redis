const db = require("../postgres.config");
const checkTableExist = async (schemaName, tableName) => {
  try {
    const result = await db.pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2);`,
      [schemaName, tableName]
    );
    return !!result.rows[0].exists;
  } catch (err) {
    console.log("Have problem with check tables: ", err);
  }
};

module.exports = { checkTableExist };
