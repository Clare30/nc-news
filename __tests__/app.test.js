const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");
const req = require("express/lib/request");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("universal errors", () => {
  test("error: 404 - path does not exist", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path does not exist");
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
          });
        });
    });
    test("error: 400 - returns error when incorrect path is entered", () => {
      return request(app)
        .get("/api/topicsss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path does not exist");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("status: 200 - returns an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 - returns an array of article objects sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("returns array of article objects with comment_count property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
            expect(article.body).toBe(undefined);
          });
        });
    });
    test("status: 200 - sorts returned articles by date decending by default", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status: 200 - sorts by value entered in query", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });
    test("status: 200 - orders by value entered in query", () => {
      return request(app)
        .get("/api/articles?order=ASC")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { ascending: true });
        });
    });
    test("status: 200 - filters by the topic entered in query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("error: 400 - sortBy is not a valid sort query", () => {
      return request(app)
        .get("/api/articles?sort_by=peas")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid query");
        });
    });
    test("error: 400 - order is not a valid order query", () => {
      return request(app)
        .get("/api/articles?order=abcde")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid query");
        });
    });
    test("error: 400 - topic is not a valid topic query", () => {
      return request(app)
        .get("/api/articles?topic=fanta")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("invalid query");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200 - responds with an article object using the id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(1);
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });

    test("status: 200 - responds with the specified article object, including the comment count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toBe(11);
          expect(article.article_id).toBe(1);
        });
    });

    test("error: 404 - when path exists but id does not", () => {
      return request(app)
        .get("/api/articles/67")
        .then(({ body }) => {
          expect(body.msg).toBe("article does not exist");
        });
    });

    test("status: 400 - when requesting an article that does not exist", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("PATCH", () => {
    test("status: 200 - returns an updated article with increased votes amended when given a positive number", () => {
      const updatedVotes = { inc_votes: 5 };
      return request(app)
        .patch("/api/articles/3")
        .send(updatedVotes)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(3);
          expect(article.votes).toBe(5);
        });
    });
    test("status: 200 - returns an updated article with increased votes amended when given a negative number", () => {
      const updatedVotes = { inc_votes: -200 };
      return request(app)
        .patch("/api/articles/1")
        .send(updatedVotes)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(-100);
        });
    });
    test("error: 404 - article does not exist", () => {
      const updatedVotes = { inc_votes: 50 };
      return request(app)
        .patch("/api/articles/90")
        .send(updatedVotes)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("article does not exist");
        });
    });
    test("error: 400 - bad request if incorrect body format is sent", () => {
      const updatedVotes = { inc_votes: "nine" };
      return request(app)
        .patch("/api/articles/4")
        .send(updatedVotes)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("bad request");
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of comments for the given article ID", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 200 - returns empty array when there are no comments for an article", () => {
      return request(app)
        .get("/api/articles/8/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });

    test("error: 404 - returns when the article does not exist", () => {
      return request(app)
        .get("/api/articles/555/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("article does not exist");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("status: 200 - returns an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
            expect(user.name).toBe(undefined);
            expect(user.avatar_url).toBe(undefined);
          });
        });
    });
  });
});
