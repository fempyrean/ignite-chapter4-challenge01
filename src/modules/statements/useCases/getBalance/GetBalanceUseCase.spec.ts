import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});
const getStatement = () => ({
  type: "deposit",
  amount: 100,
  description: "statement_description",
});

describe("Get Balance Use Case", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to get users balance", async () => {
    const user = getUser();
    const createdUser = await createUserUseCase.execute(user);
    await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      description: "statement_description",
      amount: 100,
      type: OperationType.DEPOSIT,
    });
    const balance = await getBalanceUseCase.execute({
      user_id: String(createdUser.id),
    });
    expect(balance.statement.length).toBe(1);
    expect(balance).toHaveProperty("balance");
  });
});
