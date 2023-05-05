import { getModelForClass } from "@typegoose/typegoose";
import { Account } from "./account";
import { ActivityHistory } from "./activityHistory";
import { Artifact } from "./artifact";
import { CWE } from "./cwe";
import { Phase } from "./phase";
import { Project } from "./project";
import { Task } from "./task";
import { ThirdParty } from "./thirdParty";
import { Threat } from "./threat";
import { Ticket } from "./ticket";
import { User } from "./user";
import { Vulnerability } from "./vulnerability";
import { PhaseTemplate } from "./phaseTemplate";

const AccountModel = getModelForClass(Account);
const ActivityHistoryModel = getModelForClass(ActivityHistory);
const ArtifactModel = getModelForClass(Artifact);
const CWEModel = getModelForClass(CWE);
const PhaseModel = getModelForClass(Phase);
const PhaseTemplateModel = getModelForClass(PhaseTemplate);
const ProjectModel = getModelForClass(Project);
const TaskModel = getModelForClass(Task);
const ThirdPartyModel = getModelForClass(ThirdParty);
const ThreatModel = getModelForClass(Threat);
const TicketModel = getModelForClass(Ticket);
const UserModel = getModelForClass(User);
const VulnerabilityModel = getModelForClass(Vulnerability);

export {
  AccountModel,
  ActivityHistoryModel,
  ArtifactModel,
  CWEModel,
  PhaseModel,
  PhaseTemplateModel,
  ProjectModel,
  TaskModel,
  ThirdPartyModel,
  ThreatModel,
  TicketModel,
  UserModel,
  VulnerabilityModel,
};
