import { prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
export interface Threat extends Base {}
export class Threat {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public description!: string;
}
