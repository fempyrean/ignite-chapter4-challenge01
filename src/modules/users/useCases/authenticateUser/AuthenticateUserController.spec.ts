import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import { getConnection } from "../../../../database";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await getConnection();
    await connection.runMigrations();

    const id = uuidV4();
    const password = await hash("biledrogas", 8);
    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at)
      values ('${id}', 'Admin', 'bile@rentalx.com.br', '${password}', 'NOW()')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate an user", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "bile@rentalx.com.br",
      password: "biledrogas",
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });
});
