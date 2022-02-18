const db = require("../db/connection.js");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id]
  );
  return rows;
};

