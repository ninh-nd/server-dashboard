import { Schema, Model, model } from "mongoose";
import { IProject } from "./interfaces";

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
    },
    url: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    description: String,
    startDate: Date,
    endDate: Date,
    createdBy: String,
    updatedBy: String,
    phaseList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Phase",
        default: [],
      },
    ],
  },
  { timestamps: true }
);
const Project: Model<IProject> = model("Project", projectSchema);

export { Project, projectSchema };
