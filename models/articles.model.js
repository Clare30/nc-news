const db = require("../db/connection.js");

exports.selectArticleById = async (id) => {
  const { rows } = await db.query(
    "SELECT * FROM articles WHERE article_id = $1",
    [id]
  );
  if (rows.length === 0)
    return Promise.reject({ status: 404, msg: "article does not exist" });
  else return rows[0];
};
