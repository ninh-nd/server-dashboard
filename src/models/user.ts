import { Schema, Model, model } from "mongoose";
import { IUser } from "./interfaces";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  company: String,
  taskAssigned: [
    {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: [],
    },
  ],
  ticketAssigned: [
    {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      default: [],
    },
  ],
  activityHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "ActivityHistory",
      default: [],
    },
  ],
  projectIn: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: [],
    },
  ],
});
const User: Model<IUser> = model("User", userSchema);

export { User, userSchema };
