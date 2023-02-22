import { Schema, model } from "mongoose";
import IRoom from "./IRoom";

const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  joinedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [
    {
      author: { type: Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
    },
  ],
});

export default model<IRoom>("Room", roomSchema);