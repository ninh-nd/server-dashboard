import { Schema, Model, model } from "mongoose";
import { IActivityHistory } from "./interfaces";

const activityHistorySchema = new Schema<IActivityHistory>(
  {
    id: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["commit", "pr"],
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: String,
    updatedBy: String,
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);
const ActivityHistory: Model<IActivityHistory> = model(
  "ActivityHistory",
  activityHistorySchema
);

export { ActivityHistory, activityHistorySchema };
