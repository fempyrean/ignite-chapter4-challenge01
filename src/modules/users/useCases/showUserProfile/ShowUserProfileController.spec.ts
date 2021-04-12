import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import { getConnection } from "../../../../database";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("any_password", 8);
    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      values ('${id}', 'user', 'user@mail.com.br', '${password}', 'NOW()')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show the profile of an user", async () => {
    const {
      body: { token },
    } = await request(app).post("/api/v1/sessions").send({
      email: "user@mail.com.br",
      password: "any_password",
    });
    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });
});
