import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
export interface Task extends Base {}
export class Task extends TimeStamps {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({
    required: true,
    enum: ["active", "completed"],
    default: "active",
    type: String,
  })
  public status!: string;

  @prop({ require: true, type: String })
  public description!: string;

  @prop({ type: String })
  public createdBy?: string;

  @prop({ type: String })
  public updatedBy?: string;

  @prop({ required: true, type: String })
  public projectName!: string;

  @prop({ type: Date, required: true })
  public dueDate!: Date;
}
