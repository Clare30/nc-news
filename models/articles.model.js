const db = require("../db/connection.js");

exports.selectArticles = async () => {
  const { rows } = await db.query(
    "SELECT * FROM articles ORDER BY created_at DESC;"
  );
  return rows;
};

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1;",
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({ status: 404, msg: "article does not exist" });
  return rows[0];
};

exports.amendArticle = async (id, votes) => {
  const { rows } = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [votes, id]
  );

  if (rows.length === 0)
    return Promise.reject({ status: 404, msg: "article does not exist" });
  return rows[0];
};
