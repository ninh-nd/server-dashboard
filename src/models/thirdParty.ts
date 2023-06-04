import { prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
export interface ThirdParty extends Base {}
export class ThirdParty {
  @prop({ required: true, type: String })
  public name!: string;

  @prop({ required: true, type: String })
  public username!: string;

  @prop({ type: String })
  public accessToken?: string;
}
