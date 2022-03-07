const express = require("express");
const {
  comments,
  errors,
  topics,
  users,
  endpoints,
  articles,
} = require("./controllers/");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api", endpoints.getEndpoints);
app.get("/api/topics", topics.getTopics);
app.get("/api/articles", articles.getArticles);
app.get("/api/articles/:article_id", articles.getArticleById);
app.get("/api/users", users.getUsers);
app.get("/api/articles/:article_id/comments", comments.getCommentsByArticleId);
app.patch("/api/articles/:article_id", articles.updateArticle);
app.post("/api/articles/:article_id/comments", comments.postComment);
app.delete("/api/comments/:comment_id", comments.removeComment);

app.use(errors.handleCustoms);
app.use(errors.handlePsqlErrors);
app.use(errors.incorrectPath);

module.exports = app;
