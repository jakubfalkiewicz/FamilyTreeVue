import { Schema, model } from "mongoose";
import IUser from "./IUser";

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, default: "" },
  admin: { type: Boolean, required: true, default: false },
  registrationDate: { type: Date, default: Date.now },
});

export default model<IUser>("User", userSchema);