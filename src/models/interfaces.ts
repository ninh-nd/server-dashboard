import { Types } from "mongoose";

export interface IAccount {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  thirdParty: IThirdParty[];
  role: "admin" | "manager" | "member";
  permission: string[];
}

export interface IThirdParty {
  name: string;
  username: string;
  url: string;
  accessToken: string;
}

export interface IActivityHistory {
  id: string;
  action: "commit" | "pr";
  content: string;
  createdBy: string;
  updatedBy: string;
  projectId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGithubConfig {
  projectId: Types.ObjectId;
  accessToken: string;
  repo: string;
  owner: string;
}

export interface IUser {
  name: string;
  account: Types.ObjectId;
  company: string;
  taskAssigned: ITask[];
  activityHistory: IActivityHistory[];
  projectIn: IProject[];
  ticketAssigned: ITicket[];
}

export interface ITask {
  name: string;
  status: "active" | "completed";
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  projectName: string;
}

export interface IProject {
  name: string;
  url: string;
  status: "active" | "inactive";
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  updatedBy: string;
  phaseList: IPhase[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPhase {
  name: string;
  description: string;
  order: number;
  tasks: ITask[];
  artifacts: IArtifact[];
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPhasePreset {
  name: string;
  description: string;
  phases: IPhase[];
  isPrivate: boolean;
  createdBy: string; // username
}
export interface ICWE {
  cweId: string;
  name: string;
  description: string;
  modesOfIntroduction: String[];
  likelihood: "Low" | "Medium" | "High" | "Unknown";
  mitigation: String[];
  consequences: String[];
  detectionMethods: String[];
}

export interface IVulnerability {
  cveId: string;
  description: string;
  score: number;
  severity: string;
  cwes: string[];
  availabilityImpact: string;
  confidentialityImpact: string;
  integrityImpact: string;
}

export interface IArtifact {
  name: string;
  type: "image" | "log" | "source code" | "executable" | "library";
  url: string;
  cpe?: string;
  createdAt: Date;
  updatedAt: Date;
  threatList: IThreat[];
  vulnerabilityList: IVulnerability[];
}

export interface IThreat {
  name: string;
  description: string;
}

export interface ITicket {
  title: string;
  status: "open" | "closed";
  description: string;
  priority: "low" | "medium" | "high";
  assigner: IUser;
  assignee: IUser;
  createdAt: Date;
  updatedAt: Date;
  targetedVulnerability: IVulnerability[];
  projectName: string;
}

export interface ICPE {
  cpeId: string;
  vendor: string;
  product: string;
  version: string;
}
