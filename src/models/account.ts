import { pre, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import permissions from "utils/permission";
import { ThirdParty } from "./thirdParty";
export interface Account extends Base {}
@pre<Account>("save", function () {
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
})
export class Account {
  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public password!: string;

  @prop({ lowercase: true })
  public email?: string;

  @prop({ ref: () => ThirdParty, default: [], required: true })
  public thirdParty!: ThirdParty[];

  @prop({ enum: ["admin", "manager", "member"], default: "member" })
  public role?: string;

  @prop({ required: true })
  public permission?: string[];
}
