import { Model, model, Schema } from "mongoose";
import { IArtifact } from "./interfaces";

const artifactSchema = new Schema<IArtifact>(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["image", "log", "source code", "executable", "library"],
      required: true,
    },
    url: String,
    threatList: [
      {
        type: Schema.Types.ObjectId,
        ref: "Threat",
        default: [],
      },
    ],
    vulnerabilityList: [
      {
        type: String,
        default: [],
      },
    ],
    cpe: String,
  },
  { timestamps: true }
);

const Artifact: Model<IArtifact> = model("Artifact", artifactSchema);

export { Artifact, artifactSchema };
