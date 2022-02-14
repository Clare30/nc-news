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
  test("status 404, path does not exist", () => {
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
    test("responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect((topics) => {
            topics.forEach((topic) => {
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              });
            });
          });
        });
    });
    test("404 error: returns error when incorrect path is entered", () => {
      return request(app)
        .get("/api/topicsss")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("path does not exist");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("responds with an article object using the id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect((article) => {
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(Date),
              votes: expect.any(Number),
            });
          });
        });
    });
  });
});
