import { Schema, model } from "mongoose";

interface IMenu {
  name: string;
  price: number;
  shopId: Schema.Types.ObjectId;
}

const menuSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
  },
  {
    timestamps: true,
    virtuals: {
      price_vat: {
        get() {
          return this.price * 1.07;
        },
      },
    },
    toJSON: { virtuals: true },
  }
);

const menu = model("Menu", menuSchema, "menus");

export { menu };
