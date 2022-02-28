const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

exports.selectEndpoints = () => {
  return endpoints;
};
