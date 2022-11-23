import { Types } from 'mongoose'

export interface IAccount {
  username: string
  password: string
  email: string
  thirdParty: IThirdParty[]
}

export interface IThirdParty {
  name: string
  username: string
  url: string
}

export interface IActivityHistory {
  id: string
  action: 'commit' | 'pr'
  content: string
  createdBy?: string
  updatedBy?: string
  projectId?: Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface IGithubConfig {
  projectId: Types.ObjectId
  accessToken: string
  repo: string
  owner: string
}

export interface IMember {
  name: string
  account?: Types.ObjectId
  company?: string
  taskAssigned?: ITask[]
  activityHistory?: IActivityHistory[]
  projectIn?: IProject[]
}

export interface ITask {
  name: string
  status?: 'active' | 'completed'
  description: string
  createdBy?: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface IProject {
  name: string
  url?: string
  status?: 'active' | 'inactive'
  description?: string
  startDate?: Date
  endDate?: Date
  createdBy?: string
  updatedBy?: string
  phaseList?: IPhase[]
  createdAt: Date
  updatedAt: Date
}

export interface IPhase {
  name: string
  description?: string
  previousId?: string
  nextId?: string
  tasks?: ITask[]
  createdBy?: string
  updatedBy?: string
  createdAt: Date
  updatedAt: Date
}

export interface IProjectManager {
  name: string
  account: Types.ObjectId
  company?: string
  projectOwn: IProject[]
}
