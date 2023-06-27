import { ArraySubDocumentType, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
class Resolution {
  @prop()
  public createdBy?: string;
  @prop({ required: true })
  public description!: string;
}
export interface ResolutionHistory extends Base {}
export class ResolutionHistory {
  @prop({ required: true })
  public cveId!: string;
  @prop({ required: true })
  public resolution!: ArraySubDocumentType<Resolution>[];
}
