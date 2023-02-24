import { NextFunction, Request, Response } from "express";
import { shop } from "../models/_shop";
import { menu } from "../models/menu";
import { DOMAIN } from "../config";
import { validationResult } from "express-validator";
import { saveImageToDisk } from "../bin/saveImageToDisk";
import { CustomError } from "../middlewares/errorHandler";

const index = async (req: Request, res: Response, next: NextFunction) => {
  const shops = await shop.find().sort({ _id: "desc" });
  const shopsWithPhotoDomain = shops.map((shop) => {
    if (shop.photo) {
      shop.photo = `${DOMAIN}/images/${shop.photo}`;
    } else {
      shop.photo = `${DOMAIN}/images/nopic.png`;
    }
    return {
      id: shop._id,
      name: shop.name,
      photo: shop.photo,
      location: shop.location,
    };
  });
  return res.status(200).json({ data: shopsWithPhotoDomain });
};

const getShop = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const shops = await shop.findOne({ _id: id }).populate("menus");
  return res.status(200).json({ data: shops });
};

const getMenu = async (req: Request, res: Response, next: NextFunction) => {
  // const menus = await menu.find().select("+name -price");
  const menus = await menu.find().populate("shopId");
  return res.status(200).json({ data: menus });
};

const addShop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, location, photo } = req.body;
    // Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Input is incorrect");
      error.statusCode = 422;
      error.validation = errors.array();
      throw error;
    }
    const photoName = photo ? await saveImageToDisk(photo) : undefined;
    let shopinsert = new shop({
      name: name,
      location: location,
      photo: photoName,
    });
    const result = await shopinsert.save();
    return res
      .status(201)
      .json({ message: `Insert Successful: ${result != null}` });
  } catch (e) {
    next(e);
  }
};

export { index, getMenu, getShop, addShop };
