const db = require("../db/connection.js");
const utils = require("../db/helpers/utils");

exports.selectCommentsByArticleId = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM comments WHERE article_id = $1",
    [id]
  );
  return rows;
};

exports.createComment = async (id, username, body) => {
  const userCheck = await utils.checkExists(
    "users",
    "username",
    username,
    "user does not exist"
  );

  if (!userCheck) {
    const { rows } = await db.query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;",
      [body, id, username]
    );

    return rows[0];
  }
};
