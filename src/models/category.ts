import { Schema, model } from "mongoose";

interface ICategory {
  name: string;
}

const categoryZeroObject: ICategory = {
  name: "",
};

const categorySchema = new Schema({
  name: { type: String, required: true, trim: true },
});

const category = model("Category", categorySchema, "categories");

export { category, categoryZeroObject };
export type { ICategory };
