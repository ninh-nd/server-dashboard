import { Schema, Model, model } from "mongoose";
import { IThirdParty } from "./interfaces";

const thirdPartySchema = new Schema<IThirdParty>({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  accessToken: String,
});
const ThirdParty: Model<IThirdParty> = model("ThirdParty", thirdPartySchema);
export { ThirdParty, thirdPartySchema };
