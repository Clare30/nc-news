const utils = require("../db/helpers/utils");
const models = require("../models/index");

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  return Promise.all([
    models.comments.selectCommentsByArticleId(id),
    utils.checkIdExists(id),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
