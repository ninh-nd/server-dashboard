import { ArraySubDocumentType, pre, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import permissions from "../utils/permission";
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
  @prop({ required: true, type: String })
  public username!: string;

  @prop({ required: true, type: String })
  public password!: string;

  @prop({ lowercase: true, type: String })
  public email?: string;

  @prop({ type: () => ThirdParty, default: [], required: true })
  public thirdParty!: ArraySubDocumentType<ThirdParty>[];

  @prop({
    enum: ["admin", "manager", "member"],
    default: "member",
    type: String,
  })
  public role?: string;

  @prop({ required: true, type: () => [String] })
  public permission?: string[];
}
