import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

describe("Create Statemente Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to create a deposit", async () => {
    const user = getUser();
    const createdUser = await createUserUseCase.execute(user);
    const statement = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      description: "statement_description",
      amount: 100,
      type: OperationType.DEPOSIT,
    });
    expect(statement).toHaveProperty("id");
    expect(statement.type).toBe(OperationType.DEPOSIT);
    expect(statement.amount).toBe(100);
  });

  it("should be able to make a withdraw", async () => {
    const user = getUser();
    const createdUser = await createUserUseCase.execute({
      ...user,
      email: "new_email@mail.com",
    });
    const statement = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      description: "statement_description",
      amount: 100,
      type: OperationType.DEPOSIT,
    });
    const withdraw = await createStatementUseCase.execute({
      user_id: String(createdUser.id),
      description: "withdraw_description",
      amount: 50,
      type: OperationType.WITHDRAW,
    });
    const balance = await getBalanceUseCase.execute({
      user_id: String(createdUser.id),
    });
    expect(withdraw.amount).toBe(50);
    expect(balance.balance).toBe(50);
  });
});
