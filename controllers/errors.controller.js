const app = require("../app.js");

//error handling for id does not exist

exports.handleCustoms = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
};

//error handling for psql errors
exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "42P01")
    res.status(400).send({ msg: "bad request" });
  else next(err);
};

// error handling for incorrect path for all requests
exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
};
