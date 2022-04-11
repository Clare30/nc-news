const db = require("../db/connection.js");

exports.selectUsers = async () => {
  const { rows } = await db.query("SELECT username, avatar_url FROM users;");
  return rows;
};
