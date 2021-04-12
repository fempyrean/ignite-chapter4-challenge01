import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import { getConnection } from "../../../../database";

let connection: Connection;

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

describe("Create User Controller", () => {
  beforeAll(async () => {
    const connection = await getConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send(getUser());
    expect(response.status).toBe(201);
  });
});
