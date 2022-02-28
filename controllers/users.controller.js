const {users} = require("../models/index");

exports.getUsers = (req, res, next) => {
  return users
    .selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => next(err));
};
