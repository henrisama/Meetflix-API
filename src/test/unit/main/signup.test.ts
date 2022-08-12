import request from "supertest";
import app from "@src/app";
import User from "@src/model/user";

describe("on sign up", () => {
  beforeAll(() => {});

  afterAll(async () => {
    await User.deleteMany();
  });

  describe("should create", () => {
    it("in database", async () => {
      const res = await request(app).post("/api/signup").send({
        firstName: "Test",
        lastName: "Test",
        born: "01/01/2000",
        email: "test@test.com",
        password: "mypass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeTruthy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("successfully created");
    });
  });

  describe("should not create", () => {
    it("when user already exist", async () => {
      const res = await request(app).post("/api/signup").send({
        firstName: "Test",
        lastName: "Test",
        born: "01/01/2000",
        email: "test@test.com",
        password: "mypass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("user already exist");
    });

    it("when missing value", async () => {
      const res = await request(app).post("/api/signup").send({
        firstName: "Test",
        //lastName: "Test",
        born: "01/01/2000",
        email: "test@test.com",
        password: "mypass",
      });

      expect(res.body).not.toBeNull();
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toBeFalsy();
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe(
        "missing first name, last name, born, email or password value"
      );
    });
  });
});
