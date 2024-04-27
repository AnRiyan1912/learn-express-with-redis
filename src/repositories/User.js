const db = require("../db/postgres.config");
const bcrypt = require("bcrypt");

class UserRepository {
  #db;
  constructor() {
    db = db;
  }
  async create(req, res) {
    const { username, email, password } = req.body;
    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);
    await this.#db.pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [username, email, password],
      (err, result) => {
        if (err) {
          throw err;
        }
        res
          .status(201)
          .json({ message: "Success create user", data: result.rows[0] });
      }
    );
  }
}
