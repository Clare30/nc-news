const express = require("express");
const controllers = require("./controllers/");

const app = express();

module.exports = app;

app.get("/api/topics", controllers.topics.getTopics);
app.get("/api/articles/:article_id", controllers.articles.getArticleById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path does not exist" });
});
