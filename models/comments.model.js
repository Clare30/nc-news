const db = require("../db/connection.js");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id]
  );
  return rows;
};

exports.deleteComment = async (id) => {
  const { rows } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
    [id]
  );
  return rows;
};
