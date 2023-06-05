import { ArraySubDocumentType, post, pre, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import permissions from "../utils/permission";
import { ThirdParty } from "./thirdParty";
import { ProjectModel, TaskModel, UserModel } from "./models";
export interface Account extends Base {}
@pre<Account>("validate", function () {
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
// Cascade delete on linking account
@post<Account>("findOneAndDelete", function (this, doc) {
  if (!doc) return;
  const deleteUser = UserModel.findOneAndDelete({
    username: `Github_${doc.username}`,
  });
  const deleteProject = ProjectModel.findOneAndDelete({
    createdBy: `Github_${doc.username}`,
  });
  // Optionally, delete tasks, tickets and history (TODO?)
  Promise.all([deleteUser, deleteProject]);
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

  @prop({ required: true, type: () => [String], default: [] })
  public permission!: string[];
}
