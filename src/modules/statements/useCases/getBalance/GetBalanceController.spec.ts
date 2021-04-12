import request from "supertest";
import { Connection } from "typeorm";
import { hash } from "bcryptjs";
import { v4 as uuidV4 } from "uuid";
import { app } from "../../../../app";
import { getConnection } from "../../../../database";

let connection: Connection;

describe("Get Balance Controller", () => {
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
    await connection.query(
      `INSERT INTO STATEMENTS(id, user_id, description, amount, type, created_at)
      values ('${uuidV4()}', '${id}', 'deposit_description', 100, 'deposit', 'NOW()')
    `
    );
    await connection.query(
      `INSERT INTO STATEMENTS(id, user_id, description, amount, type, created_at)
      values ('${uuidV4()}', '${id}', 'withdrawal_description', 10, 'withdraw', 'NOW()')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get a users balance", async () => {
    const {
      body: { token },
    } = await request(app).post("/api/v1/sessions").send({
      email: "user@mail.com.br",
      password: "any_password",
    });
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });
    expect(response.status).toBe(200);
    expect(response.body.statement.length).toBe(2);
  });
});
