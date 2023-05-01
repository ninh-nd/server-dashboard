import { prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
export interface ThirdParty extends Base {}
export class ThirdParty {
  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public username!: string;

  @prop({ required: true })
  public url!: string;

  @prop()
  public accessToken?: string;
}
