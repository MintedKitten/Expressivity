import { NextFunction, Request, Response } from "express";
import { IProduct, product, productZeroObject } from "../models/product";
import { validationResult } from "express-validator";
import { CustomError } from "../middlewares/errorHandler";

/**
 * Get All Products
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getproduct = async (req: Request, res: Response, next: NextFunction) => {
  const products = await product.find().populate("categoryId");
  return res.status(200).json({ data: { products: products } });
};

/**
 * Get A Product
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getoneproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const products = await product.findById(id).populate("categoryId");
  return res.status(200).json({ data: { product: products } });
};

/**
 * Add A Product
 * @param req
 * @param res
 * @param next
 * @returns
 */
const addproduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const valerr = validationResult(req);
    if (!valerr.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = valerr.array();
      throw error;
    }
    const { name, description, price, categoryId } = req.body as IProduct;

    const insertproduct = new product({
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
    });
    const result = await insertproduct.save();
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
 * Updaet A Product
 * @param req
 * @param res
 * @param next
 * @returns
 */
const updateproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IProduct> = {};
    const reqBodyKeys = Object.keys(req.body);
    const productKeys = Object.keys(productZeroObject) as (keyof IProduct)[];
    for (const key of productKeys) {
      if (reqBodyKeys.includes(key)) {
        updateData[key] = req.body[key];
      }
    }
    const productupdate = await product.updateOne({ _id: id }, updateData);
    if (productupdate.modifiedCount === 0) {
      const error = new CustomError("No Product was modified");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Updated Successfully" });
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete A Product
 * @param req
 * @param res
 * @param next
 * @returns
 */
const deleteproduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const productdelete = await product.deleteOne({ _id: id });
    if (productdelete.deletedCount === 0) {
      const error = new CustomError("No Product was deleted");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Deleted Successfully" });
  } catch (e) {
    return next(e);
  }
};

export { getproduct, getoneproduct, addproduct, updateproduct, deleteproduct };
