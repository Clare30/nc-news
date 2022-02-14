const db = require("../db/connection.js");

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [id]
  );
  return rows[0];
};
