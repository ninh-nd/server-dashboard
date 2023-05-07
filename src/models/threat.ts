import { prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
export interface Threat extends Base {}
export class Threat {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public description!: string;

  @prop({
    required: true,
    type: String,
    enum: [
      "Spoofing",
      "Tampering",
      "Repudiation",
      "Information Disclosure",
      "Denial of Service",
      "Elevation of Privilege",
    ],
  })
  public category!: string;

  @prop({ type: String })
  public mitigation?: string;
}
