const db = require("../db/connection.js");

exports.selectArticles = async (
  sortBy = "created_at",
  order = "DESC",
  topic
) => {
  const acceptedOrders = ["ASC", "DESC"];
  const acceptedSort = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const acceptedTopic = [
    "mitch",
    "cats",
    "paper",
    "coding",
    "cooking",
    "football",
  ];
  const queryVals = [];
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.comment_id)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic && !acceptedTopic.includes(topic)) {
    return Promise.reject({ status: 404, msg: "topic not found" });
  } else if (topic) {
    queryVals.push(topic);
    queryStr += ` WHERE topic = $1 `;
  }
  queryStr += ` GROUP BY articles.article_id`;

  if (!acceptedSort.includes(sortBy) || !acceptedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query" });
  } else queryStr += ` ORDER BY ${sortBy} ${order}`;

  queryStr += ";";

  const { rows } = await db.query(queryStr, queryVals);
  if (rows.length === 0) {
    return Promise.reject({ status: 404, msg: "no articles found" });
  }
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
