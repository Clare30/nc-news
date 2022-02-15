const models = require("../models/index");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  return models.articles
    .selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const id = req.params.article_id;
  const votes = req.body.inc_votes;

  return models.articles
    .amendArticle(id, votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
