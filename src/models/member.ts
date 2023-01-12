import { Schema, Model, model } from "mongoose";
import { IMember } from "./interfaces";

const memberSchema = new Schema<IMember>({
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
const Member: Model<IMember> = model("Member", memberSchema);

export { Member, memberSchema };
