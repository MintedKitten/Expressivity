import { Schema, model } from "mongoose";

interface ILocation {
  address: string;
  cords: { lat: number; lgn: number };
  openTime: string;
  closeTime: string;
}

const locationZeroObject: ILocation = {
  address: "",
  cords: { lat: 0, lgn: 0 },
  openTime: "",
  closeTime: "",
};

const locationSchema = new Schema({
  address: { type: String, required: true, trim: true },
  cords: {
    lat: { type: Number, required: true },
    lgn: { type: Number, required: true },
  },
  openTime: { type: String, required: true, trim: true },
  closeTime: { type: String, required: true, trim: true },
});

const location = model("Location", locationSchema, "locations");

export { location, locationZeroObject };
export type { ILocation };
