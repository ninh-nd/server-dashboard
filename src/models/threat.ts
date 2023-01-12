import { Model, model, Schema } from "mongoose";
import { IThreat } from "./interfaces";

const threatSchema = new Schema<IThreat>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Threat: Model<IThreat> = model("Threat", threatSchema);

export { Threat, threatSchema };
