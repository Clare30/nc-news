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

describe("/api/topics", () => {
  describe("GET", () => {
    test("responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveLength(3);
          expect((body) => {
            body.forEach((topic) => {
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              });
            });
          });
        });
    });
  });
});
