import { model, Schema, Model } from "mongoose";
import { IAccount } from "./interfaces";
import { thirdPartySchema } from "./thirdParty";

const accountSchema = new Schema<IAccount>({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  thirdParty: [
    {
      type: thirdPartySchema,
      default: [],
    },
  ],
});
const Account: Model<IAccount> = model("Account", accountSchema);

export { Account, accountSchema };
