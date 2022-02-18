const utils = require("../db/helpers/utils");
const models = require("../models/index");

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  return Promise.all([
    models.comments.selectCommentsByArticleId(id),
    utils.checkExists("articles", "article_id", id, "article does not exist"),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.article_id;
  const body = req.body.body;
  const username = req.body.username;
  return Promise.all([
    utils.checkExists("articles", "article_id", id, "article does not exist"),
    models.comments.createComment(id, username, body),
    ,
  ])
    .then(([articleCheck, comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  return Promise.all([
    models.comments.deleteComment(id),
    utils.checkExists("comments", "comment_id", id, "comment does not exist"),
  ])
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};
