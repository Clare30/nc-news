const db = require("../db/connection.js");
const app = require("../app.js");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed.js");

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
          expect(article.comment_count).toBe("11");
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
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
  });
});
