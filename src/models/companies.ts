import { Schema, model } from "mongoose";

interface ICompany {
  name: string;
  address: { province: string; postcode: string };
}

const companiesSchema = new Schema({
  name: { type: String, required: true, trim: true },
  address: {
    province: { type: String, required: true, trim: true },
    postcode: { type: String, required: true, trim: true },
  },
});

const company = model("Company", companiesSchema, "companies");

export { company };
