import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { DOMAIN } from "../config";
import { staff } from "../models/staff";
import { CustomError } from "../middlewares/errorHandler";
import { saveImageToDisk } from "../bin/saveImageToDisk";

const getstaff = async (req: Request, res: Response, next: NextFunction) => {
  const staffResult = await staff.find().sort({ _id: "desc" });
  const staffWithPhotoDomain = staffResult.map((staff) => {
    if (staff.photo) {
      staff.photo = `${DOMAIN}/images/${staff.photo}`;
    } else {
      staff.photo = `${DOMAIN}/images/nopic.png`;
    }
    return {
      id: staff._id,
      name: staff.name,
      photo: staff.photo,
      salary: staff.salary,
    };
  });
  return res.status(200).json({ data: staffWithPhotoDomain });
};

const poststaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, salary, photo } = req.body;
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const photoName = photo ? await saveImageToDisk(photo) : undefined;
    let staffinsert = new staff({
      name: name,
      salary: salary,
      photo: photoName,
    });
    const result = await staffinsert.save();
    return res
      .status(200)
      .json({ message: `Insert Successful: ${result != null}` });
  } catch (e) {
    next(e);
  }
};

const showstaff = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const staffResult = await staff.findById(id);
  if (!staffResult) {
    const error = new CustomError("No Staff found");
    error.statusCode = 405;
    return next(error);
  }
  return res.status(200).json({ data: staffResult });
};

const removestaff = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const staffResult = await staff.deleteOne({ _id: id });
  if (!staffResult.deletedCount) {
    const error = new CustomError("No Staff was deleted");
    error.statusCode = 405;
    return next(error);
  }
  return res.status(200).json({ data: staffResult });
};

const updatestaff = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { name, salary } = req.body;
  const staffupdate = await staff.updateOne(
    { _id: id },
    { name: name, salary: salary }
  );
  if (!staffupdate.modifiedCount) {
    const error = new CustomError("No Staff was modified");
    error.statusCode = 405;
    return next(error);
  }
  return res.status(200).json({ message: "Update Successful" });
};

export { getstaff, poststaff, showstaff, removestaff, updatestaff };
