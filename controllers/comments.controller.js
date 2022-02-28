const utils = require("../db/helpers/utils");
const { comments } = require("../models/index");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return Promise.all([
    comments.selectCommentsByArticleId(article_id),
    utils.checkExists(
      "articles",
      "article_id",
      article_id,
      "article does not exist"
    ),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { body, username } = req.body;

  return comments
    .createComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  return Promise.all([
    comments.deleteComment(comment_id),
    utils.checkExists(
      "comments",
      "comment_id",
      comment_id,
      "comment does not exist"
    ),
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
