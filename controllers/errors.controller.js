const app = require("../app.js");

// error handling for incorrect path for all requests
exports.incorrectPath = (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
};
