import request from "supertest";
import app from "@src/app";
import User from "@src/model/user";
import setCookieParser from "set-cookie-parser";
import "@src/test/matcher/toContainObject";

describe("on signin", () => {
  beforeAll(() => {});

  afterAll(async () => {
    await User.deleteMany();
  });

  describe("should signin", () => {
    it("in database", async () => {
      /* create user */
      await request(app).post("/api/signup").send({
        firstName: "Test",
        lastName: "Test",
        born: "01/01/2000",
        email: "test@test.com",
        password: "mypass",
      });

      /* make login */
      const res = await request(app).post("/api/signin").send({
        email: "test@test.com",
        password: "mypass",
      });

      const cookies = setCookieParser.parse(res.headers["set-cookie"]);

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeTruthy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("successfully logged in");
      expect(cookies).toContainObject({ name: "jwt" });
      expect(cookies).toContainObject({ name: "idUser" });
    });
  });

  describe("should not signin", () => {
    it("when user does not exist", async () => {
      const res = await request(app).post("/api/signin").send({
        email: "random@random.com",
        password: "mypass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("user does not exist");
    });

    it("when missing value", async () => {
      const res = await request(app).post("/api/signin").send({
        //email: "test@test.com",
        password: "mypass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("missing email or password value");
    });

    it("when passwords do not match", async () => {
      const res = await request(app).post("/api/signin").send({
        email: "test@test.com",
        password: "random pass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("passwords do not match");
    });
  });
});
