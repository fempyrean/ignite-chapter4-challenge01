import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

describe("Create User Use Case", () => {
  beforeEach(async () => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user = getUser();
    await createUserUseCase.execute(user);
    const createdUser = await userRepositoryInMemory.findByEmail(user.email);
    expect(createdUser).toHaveProperty("id");
  });
});
