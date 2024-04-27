const { checkTableExist } = require("./checkTable");
const { createTableUsers } = require("./user");

const migrateTable = async () => {
  try {
    const usersCheck = await checkTableExist("public", "users");
    if (!usersCheck) {
      createTableUsers();
    }
    console.log("Table already migrate");
  } catch (err) {
    console.log("Failed migrate table with error: ", err);
  }
};

const dropTable = async () => {};

module.exports = { migrateTable };
