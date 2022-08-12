import request from "supertest";
import app from "@src/app";

describe("on failure", () => {
  beforeAll(() => {});

  afterAll(async () => {});

  it("failure route", async () => {
    const res = await request(app).get("/api/auth/failure");

    expect(res.body).not.toBeNull();
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty("success");
    expect(res.body.success).toBeFalsy();
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("error when logging in");
  });
});
