import { Types } from "mongoose";
import IUser from "./IUser";

interface IRoom extends Document {
    name: string;
    joinedUsers: Types.ObjectId[] | IUser[];
    messages: {
      author: Types.ObjectId | IUser;
      message: string;
    }[];
  }

export default IRoom