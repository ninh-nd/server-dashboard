import { prop, Ref } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { User } from "./user";
import { Vulnerability } from "./vulnerability";
export interface Ticket extends Base {}
export class Ticket extends TimeStamps {
  @prop({ required: true, type: String })
  public title!: string;

  @prop({ required: true, ref: () => User })
  public assignee!: Ref<User>;

  @prop({ required: true, ref: () => User })
  public assigner!: Ref<User>;

  @prop({
    required: true,
    enum: ["open", "closed"],
    default: "open",
    type: String,
  })
  public status!: string;

  @prop({ type: String })
  public description?: string;

  @prop({
    required: true,
    enum: ["low", "medium", "high"],
    default: "low",
    type: String,
  })
  public priority!: string;

  @prop({ ref: () => Vulnerability, default: [] })
  public targetedVulnerability?: Ref<Vulnerability>[];

  @prop({ required: true, type: String })
  public projectName!: string;
}
