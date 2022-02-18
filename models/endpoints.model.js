const fs = require("fs/promises");

exports.selectEndpoints = async () => {
  const file = await fs.readFile("./endpoints.json", "utf-8");

  return file;
};
