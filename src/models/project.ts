import { Ref, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Phase } from "./phase";
export interface Project extends Base {}
export class Project extends TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop()
  public url?: string;

  @prop({ required: true, enum: ["active", "inactive"], default: "active" })
  public status!: string;

  @prop()
  public description?: string;

  @prop()
  public startDate?: Date;

  @prop()
  public endDate?: Date;

  @prop()
  public createdBy?: string;

  @prop()
  public updatedBy?: string;

  @prop({ ref: "Phase", default: [] })
  public phaseList?: Ref<Phase>[];
}
