import { ArraySubDocumentType, prop } from "@typegoose/typegoose";
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

  @prop({ type: () => Threat, default: [] })
  public threatList?: ArraySubDocumentType<Threat>[];

  @prop({ default: [], type: () => Vulnerability })
  public vulnerabilityList?: ArraySubDocumentType<Vulnerability>[];

  @prop()
  public cpe?: string;
}
