const db = require("../db/connection.js");
const utils = require("../db/helpers/utils");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC" ,
    [id]
  );
  return rows;
};

exports.createComment = async (id, username, body) => {
  const articleCheck = await utils.checkExists(
    "articles",
    "article_id",
    id,
    "article does not exist"
  );
  if (!articleCheck) {
    const { rows } = await db.query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, id, username]
    );

    return rows[0];
  }
};

exports.deleteComment = async (id) => {
  const { rows } = await db.query(
    "DELETE FROM comments WHERE comment_id = $1 RETURNING *;",
    [id]
  );
  return rows;
};
