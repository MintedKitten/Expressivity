import { NextFunction, Request, Response } from "express";
import { company } from "../models/companies";
import { CustomError } from "../middlewares/errorHandler";

const showall = async (req: Request, res: Response, next: NextFunction) => {
  const result = await company.find();
  return res.status(200).json({ data: result });
};

const showone = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const result = await company.findById(id);
  return res.status(200).json({ data: result });
};

const insert = async (req: Request, res: Response, next: NextFunction) => {
  const { name, address } = req.body;
  let compInsert = new company({ name: name, address: address });
  const result = await compInsert.save();
  return res
    .status(200)
    .json({ message: `Insert Successful: ${result != null}` });
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, address } = req.body;
  const result = await company.updateOne(
    { _id: id },
    { name: name, address: address }
  );
  if (!result.modifiedCount) {
    const error = new CustomError("No company was modified");
    error.statusCode = 405;
    return next(error);
  }
  return res.status(200).json({ message: "Update Successful" });
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  console.log(id);
  const result = await company.deleteOne({ _id: id });
  if (!result.deletedCount) {
    const error = new CustomError("No company was deleted");
    error.statusCode = 405;
    return next(error);
  }
  return res.status(200).json({ data: result });
};

export { showall, showone, insert, update, remove };
