import { Schema, model } from "mongoose";
import { IPhasePreset } from "./interfaces";

const phasePresetSchema = new Schema<IPhasePreset>({
  name: {
    type: String,
    required: true,
  },
  description: String,
  phases: [
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
    },
  ],
  isPrivate: {
    type: Boolean,
    required: true,
    default: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
});

const PhasePreset = model<IPhasePreset>("PhasePreset", phasePresetSchema);

export { PhasePreset, phasePresetSchema };
