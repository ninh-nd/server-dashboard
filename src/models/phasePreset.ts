import { ArraySubDocumentType, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
export interface PhasePreset extends Base {}
class Phase {
  @prop({ required: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop({ required: true })
  public order!: number;
}

export class PhasePreset {
  @prop({ required: true })
  public name!: string;

  @prop()
  public description?: string;

  @prop({ _id: false, type: () => Phase })
  public phases?: ArraySubDocumentType<Phase>[];

  @prop({ default: true })
  public isPrivate?: boolean;

  @prop({ required: true })
  public createdBy!: string;
}
