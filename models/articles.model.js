const db = require("../db/connection.js");

exports.selectArticles = async () => {
  const { rows } = await db.query(
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC;"
  );
  return rows;
};

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT articles.*, COUNT(comments.comment_id)::int AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
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
