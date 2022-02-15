const models = require("../models/index");

exports.getUsers = (req, res, next) => {
  return models.users.selectUsers().then((users) => {
    res.status(200).send({ users });
  });
};
