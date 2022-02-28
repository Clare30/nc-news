const models = require("../models/index");
const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
    res.status(200).send({ endpoints });
}