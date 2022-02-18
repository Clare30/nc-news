const models = require("../models/index");

exports.getEndpoints = (req, res, next) => {
  return models.endpoints
    .selectEndpoints()
    .then((endpoints) => {
      const parsedEndpoints = JSON.parse(endpoints);
      res.status(200).send({ endpoints: parsedEndpoints });
    })
    .catch((err) => {
      next(err);
    });
};
