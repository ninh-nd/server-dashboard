import { Schema, Model, model } from "mongoose";
import { IPhase } from "./interfaces";

const phaseSchema = new Schema<IPhase>(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    order: {
      type: Number,
      required: true,
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
        default: [],
      },
    ],
    artifacts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Artifact",
        default: [],
      },
    ],
    createdBy: String,
    updatedBy: String,
  },
  { timestamps: true }
);
const Phase: Model<IPhase> = model("Phase", phaseSchema);

export { Phase, phaseSchema };
