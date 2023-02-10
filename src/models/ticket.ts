import { Model, model, Schema } from "mongoose";
import { ITicket } from "./interfaces";

const ticketSchema = new Schema<ITicket>(
  {
    title: {
      type: String,
      required: true,
    },
    assignee: [
      {
        type: Schema.Types.ObjectId,
        ref: "Member",
        required: true,
      },
    ],
    assigner: {
      type: Schema.Types.ObjectId,
      refPath: "roleModel",
      required: true,
    },
    roleModel: {
      type: String,
      required: true,
      enum: ["Member", "ProjectManager"],
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    description: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    targetedVulnerability: [
      {
        type: Schema.Types.ObjectId,
        ref: "Vulnerability",
        default: [],
      },
    ],
    projectName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Ticket: Model<ITicket> = model("Ticket", ticketSchema);

export { Ticket, ticketSchema };
