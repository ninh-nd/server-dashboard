import { Schema, Model, model } from "mongoose";
import { IProjectManager } from "./interfaces";

const projectManagerSchema = new Schema<IProjectManager>({
  name: {
    type: String,
    required: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  company: String,
  projectOwn: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
  ],
});
const ProjectManager: Model<IProjectManager> = model(
  "ProjectManager",
  projectManagerSchema
);

export { ProjectManager, projectManagerSchema };
