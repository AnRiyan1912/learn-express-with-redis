const { migrateTable } = require("./db/tables");
const expressApp = require("./expressApp");
const { initializedRedisClient } = require("./middlewares/redis");

const PORT = process.env.PORT || 3000;
const StartServer = async () => {
  await initializedRedisClient();
  expressApp.listen(PORT, () => {
    console.log(`App listening to port ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });

  await migrateTable();
};

StartServer().then(() => {
  console.log("Server is up");
});
