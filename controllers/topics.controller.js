const { topics } = require("../models/index");

exports.getTopics = (req, res, next) => {
  topics
    .selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};
