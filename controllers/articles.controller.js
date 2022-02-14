const { selectArticleById } = require("../models/articles.model");
const models = require("../models/index");

exports.getArticleById = (req, res) => {
  const id = req.params.article_id;
  return models.articles.selectArticleById(id).then((article) => {
    res.status(200).send({ article });
  });
};
