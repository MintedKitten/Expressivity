import { Schema, model } from "mongoose";

interface IStaff {
  name: string;
  salary: number;
  photo: string;
  create: Date;
}

const staffSchema = new Schema({
  name: { type: String, required: true, trim: true },
  salary: { type: Number, required: true },
  photo: { type: String, default: "nopic.png" },
  created: { type: Date, default: Date.now() },
});

const staff = model("Staff", staffSchema, "staff");

export { staff };
export type { IStaff };
