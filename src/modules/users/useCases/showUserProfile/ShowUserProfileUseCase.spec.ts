import { exception } from "console";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to get info of authenticated user", async () => {
    const user = await createUserUseCase.execute(getUser());
    const profile = await showUserProfileUseCase.execute(String(user.id));
    expect(profile.id).toBe(user.id);
    expect(profile.email).toBe(user.email);
  });
});
