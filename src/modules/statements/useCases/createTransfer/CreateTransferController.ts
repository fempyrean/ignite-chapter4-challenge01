import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateTransferUseCase } from "./CreateTransferUseCase";
import { OperationType } from "../../entities/Statement";

class CreateTransferController {
  async execute(req: Request, res: Response): Promise<Response> {
    const { id: sender_id } = req.user;
    const { amount, description } = req.body;
    const { user_id: receiver_id } = req.params;

    const splittedPath = req.originalUrl.split("/");
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransfer = container.resolve(CreateTransferUseCase);

    const transfer = await createTransfer.execute({
      sender_id,
      receiver_id,
      amount,
      description,
    });

    return res.status(201).send();
  }
}
export { CreateTransferController };
