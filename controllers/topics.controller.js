const models = require("../models/index");

exports.getTopics = (req, res, next) => {
  models.topics
    .selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
