import { Ref, prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Threat } from "./threat";
import { Vulnerability } from "./vulnerability";
export interface Artifact extends Base {}
export class Artifact extends TimeStamps {
  @prop({ required: true })
  public name!: string;

  @prop({
    required: true,
    enum: ["image", "log", "source code", "executable", "library"],
  })
  public type!: string;

  @prop()
  public url?: string;

  @prop({ ref: () => Threat, default: [] })
  public threatList?: Ref<Threat>[];

  @prop({ default: [], ref: () => Vulnerability })
  public vulnerabilityList?: Ref<Vulnerability>[];

  @prop()
  public cpe?: string;
}
