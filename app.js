const express = require("express");
const controllers = require("./controllers/");
const errors = require("./controllers/errors.controller");

const app = express();
app.use(express.json());

module.exports = app;

app.get("/api/topics", controllers.topics.getTopics);
app.get("/api/articles/:article_id", controllers.articles.getArticleById);
app.get("/api/users", controllers.users.getUsers);
app.patch("/api/articles/:article_id", controllers.articles.updateArticle);

app.use(errors.handleCustoms);
app.use(errors.handlePsqlErrors);
app.use(errors.incorrectPath);
