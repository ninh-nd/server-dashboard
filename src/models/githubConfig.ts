import { Ref, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Project } from "./project";
export interface GithubConfig extends Base {}
export class GithubConfig {
  @prop({ ref: () => Project, required: true })
  public projectId!: Ref<Project>;

  @prop({ required: true, type: String })
  public accessToken!: string;

  @prop({ required: true, type: String })
  public repo!: string;

  @prop({ required: true, type: String })
  public owner!: string;
}
