import { Document } from "mongoose";
interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    admin: boolean;
    registrationDate: Date;
  }

export default IUser