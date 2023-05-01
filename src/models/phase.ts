import { Ref, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Artifact } from "./artifact";
import { Task } from "./task";
export interface Phase extends Base {}
export class Phase {
  @prop({ required: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop({ required: true })
  public order!: number;

  @prop({ ref: () => Task, default: [] })
  public tasks?: Ref<Task>[];

  @prop({ ref: () => Artifact, default: [] })
  public artifacts?: Ref<Artifact>[];

  @prop()
  public createdBy?: string;

  @prop()
  public updatedBy?: string;
}
