import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    password: { type: String, required: true, trim: true, minlength: 5 },
    role: { type: String, required: true, trim: true, default: "member" },
  },
  {
    methods: {
      async encryptPassword(password: string) {
        const salt = await bcrypt.genSalt(5);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
      },
      async checkPassword(password: string) {
        const isValid = bcrypt.compare(password, this.password);
        return isValid;
      },
    },
  }
);

const user = model("User", userSchema, "users");

export { user };
export type { IUser };
