import { model, Schema, Model } from "mongoose";
import { IAccount } from "./interfaces";
import { thirdPartySchema } from "./thirdParty";
import permissions from "utils/permission";

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
    lowercase: true,
  },
  thirdParty: [
    {
      type: thirdPartySchema,
      default: [],
    },
  ],
  role: {
    type: String,
    enum: ["admin", "manager", "member"],
    default: "member",
  },
  permission: [
    {
      type: String,
      required: true,
    },
  ],
});
accountSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.permission = permissions;
  } else if (this.role === "manager") {
    const perm = permissions.filter((p) => {
      if (p.includes("user") || p.includes("account")) return false;
    });
    this.permission = perm;
  } else {
    const perm = permissions.filter((p) => {
      if (
        p.includes("user") ||
        p.includes("account") ||
        p.includes("phase") ||
        p.includes("project")
      )
        return false;
    });
    this.permission = perm;
  }
  next();
});
const Account: Model<IAccount> = model("Account", accountSchema);

export { Account, accountSchema };
