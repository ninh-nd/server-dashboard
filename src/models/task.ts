import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
export interface Task extends Base {}
export class Task extends TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true, enum: ["active", "completed"], default: "active" })
  public status!: string;

  @prop({ require: true })
  public description!: string;

  @prop()
  public createdBy?: string;

  @prop()
  public updatedBy?: string;

  @prop({ required: true })
  public projectName!: string;
}
