import { Model, model, Schema } from "mongoose";
import { IArtifact } from "./interfaces";

const artifactSchema = new Schema<IArtifact>(
  {
    name: {
      type: String,
      required: true,
    },
    content: String,
    type: {
      type: String,
      enum: ["image", "log", "source code", "executable", "library"],
      required: true,
    },
    url: String,
    version: String,
    threatList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Threat",
        default: [],
      },
    ],
    vulnerabilityList: [
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

const Artifact: Model<IArtifact> = model("Artifact", artifactSchema);

export { Artifact, artifactSchema };
