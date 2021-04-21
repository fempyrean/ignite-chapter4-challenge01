import { injectable, inject } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateTransferDTO } from "./ICreateTransferDTO";
import { CreateStatementError } from "../createStatement/CreateStatementError";

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject("StatementsRepository")
    private readonly statementsRepository: IStatementsRepository,
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({
    sender_id,
    receiver_id,
    amount,
    description,
  }: ICreateTransferDTO): Promise<void> {
    const receiver = await this.usersRepository.findById(receiver_id);
    if (!receiver) throw new AppError("Could not find receiver");
    const sender = await this.usersRepository.findById(sender_id);
    if (!sender) throw new AppError("Could not find sender");

    const { balance } = await this.statementsRepository.getUserBalance({
      user_id: sender_id,
    });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds();
    }

    /** Creating transfer for sender */
    const senderTransfer = await this.statementsRepository.create({
      sender_id: sender.id,
      user_id: sender_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });

    const receiverTransfer = await this.statementsRepository.create({
      sender_id: sender.id,
      user_id: receiver_id,
      amount,
      description,
      type: OperationType.TRANSFER,
    });
  }
}
export { CreateTransferUseCase };
