import { Ref, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Project } from "./project";
export interface ActivityHistory extends Base {}
export class ActivityHistory extends TimeStamps {
  @prop({ required: true })
  public id!: string;

  @prop({ required: true, enum: ["commit", "pr"] })
  public action!: string;

  @prop({ required: true })
  public content!: string;

  @prop()
  public createdBy?: string;

  @prop()
  public updatedBy?: string;

  @prop({ ref: () => Project })
  public projectId?: Ref<Project>;
}
