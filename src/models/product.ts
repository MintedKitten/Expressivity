import { Schema, model } from "mongoose";

interface IProduct {
  name: string;
  description: string;
  price: number;
  categoryId: Schema.Types.ObjectId;
}

const productZeroObject: IProduct = {
  name: "",
  description: "",
  price: 0,
  categoryId: new Schema.Types.ObjectId(""),
};

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
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

const product = model("Product", productSchema, "products");

export { product, productZeroObject };
export type { IProduct };
