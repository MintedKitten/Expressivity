import { NextFunction, Request, Response } from "express";
import { ILocation, location, locationZeroObject } from "../models/location";
import { validationResult } from "express-validator";
import { CustomError } from "../middlewares/errorHandler";

/**
 * Get All Locations
 * @param req
 * @param res
 * @param next
 * @returns
 */
const getlocation = async (req: Request, res: Response, next: NextFunction) => {
  const locations = await location.find();
  return res.status(200).json({ data: { locations: locations } });
};

/**
 * Add A Location
 * @param req
 * @param res
 * @param next
 * @returns
 */
const addlocation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verify Input
    const valerr = validationResult(req);
    if (!valerr.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = valerr.array();
      throw error;
    }
    const { cords, address, openTime, closeTime } = req.body as ILocation;

    const insertlocation = new location({
      address: address,
      cords: cords,
      openTime: openTime,
      closeTime: closeTime,
    });
    const result = await insertlocation.save();
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
 * Update A Location
 * @param req
 * @param res
 * @param next
 * @returns
 */
const updatelocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData: Partial<ILocation> = {};
    const reqBodyKeys = Object.keys(req.body);
    const locationKeys = Object.keys(locationZeroObject) as (keyof ILocation)[];
    for (const key of locationKeys) {
      if (reqBodyKeys.includes(key)) {
        updateData[key] = req.body[key];
      }
    }
    const locationupdate = await location.updateOne({ _id: id }, updateData);
    if (locationupdate.modifiedCount === 0) {
      const error = new CustomError("No Location was modified");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Updated Successfully" });
  } catch (e) {
    return next(e);
  }
};

/**
 * Delete A Location
 * @param req
 * @param res
 * @param next
 * @returns
 */
const deletelocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const locationdelete = await location.deleteOne({ _id: id });
    if (locationdelete.deletedCount === 0) {
      const error = new CustomError("No Location was deleted");
      error.statusCode = 405;
      throw error;
    }
    return res.status(201).json({ message: "Deleted Successfully" });
  } catch (e) {
    return next(e);
  }
};

export { getlocation, addlocation, updatelocation, deletelocation };
