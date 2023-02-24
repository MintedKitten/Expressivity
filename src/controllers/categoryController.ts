import { NextFunction, Request, Response } from "express";
import { ICategory, category, categoryZeroObject } from "../models/category";
import { validationResult } from "express-validator";
import { CustomError } from "../middlewares/errorHandler";
import { product } from "../models/product";

/**
 * Get All Categories
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getcategory = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await category.find();
  return res.status(200).json({ data: { category: categories } });
};

/**
 * Get Product By Category
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getbycategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { category } = req.params;
  const categoryresult = await product.find({ categoryId: category });
  return res.status(200).json({ data: { products: categoryresult } });
};

/**
 * Add A Category
 * @param req
 * @param res
 * @param next
 * @returns
 */
const addcategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const valerr = validationResult(req);
    if (!valerr.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = valerr.array();
      throw error;
    }
    const { name } = req.body as ICategory;

    const insertcategory = new category({
      name: name,
    });
    const result = await insertcategory.save();
    if (result === null) {
      const error = new CustomError("Insert was unsuccessful");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Inserted Successfully" });
  } catch (e) {
    return next(e);
  }
};

/**
 * Update A Category
 * @param req
 * @param res
 * @param next
 * @returns
 */
const updatecategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData: Partial<ICategory> = {};
    const reqBodyKeys = Object.keys(req.body);
    const productKeys = Object.keys(categoryZeroObject) as (keyof ICategory)[];
    for (const key of productKeys) {
      if (reqBodyKeys.includes(key)) {
        updateData[key] = req.body[key];
      }
    }
    const productupdate = await category.updateOne({ _id: id }, updateData);
    if (productupdate.modifiedCount === 0) {
      const error = new CustomError("No Category was modified");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Updated Successfully" });
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete A Category
 * @param req
 * @param res
 * @param next
 * @returns
 */
const deletecategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const categorydelete = await category.deleteOne({ _id: id });
    if (categorydelete.deletedCount === 0) {
      const error = new CustomError("No Category was deleted");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Deleted Successfully" });
  } catch (e) {
    return next(e);
  }
};

export {
  getcategory,
  getbycategory,
  addcategory,
  updatecategory,
  deletecategory,
};
