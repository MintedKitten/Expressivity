import { Schema, model } from "mongoose";

interface IShop {
  name: string;
  photo: string;
  location: { lat: number; lgn: number };
}

const shopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "nopic.png" },
    location: {
      lat: { type: Number, required: true },
      lgn: { type: Number, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      menus: {
        options: { ref: "Menu", localField: "_id", foreignField: "shopId" },
      },
    },
  }
);

const shop = model("Shop", shopSchema, "shops");

export { shop };
export type { IShop };
