const models = require("../models/index");

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  return models.comments.selectCommentsByArticleId(id).then((comments) => {
    res.status(200).send({ comments });
  });
};
