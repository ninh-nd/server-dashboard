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
        ref: "User",
        required: true,
      },
    ],
    assigner: {
      type: Schema.Types.ObjectId,
      refPath: "User",
      required: true,
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
