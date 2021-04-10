import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;

const getUser = () => ({
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

describe("Get Statemente Operation Use Case", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to get find a statement by id", async () => {
    const user = getUser();
    const { id: user_id } = await createUserUseCase.execute(user);
    const { id: statement_id } = await createStatementUseCase.execute({
      user_id: String(user_id),
      description: "statement_description",
      amount: 100,
      type: OperationType.DEPOSIT,
    });
    const statement = await getStatementOperationUseCase.execute({
      user_id: String(user_id),
      statement_id: String(statement_id),
    });
    expect(statement.id).toBe(statement_id);
    expect(statement.type).toBe(OperationType.DEPOSIT);
    expect(statement.amount).toBe(100);
  });
});
