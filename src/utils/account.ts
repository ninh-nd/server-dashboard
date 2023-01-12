import { Types } from "mongoose";
import { Member } from "models/member";
import { ProjectManager } from "models/projectManager";

async function getRole(accountId: Types.ObjectId) {
  const member = await Member.findOne({ account: accountId });
  const projectManager = await ProjectManager.findOne({ account: accountId });
  if (member != null) {
    return {
      role: "member",
      id: member._id,
    };
  }
  if (projectManager != null) {
    return {
      role: "manager",
      id: projectManager._id,
    };
  }
}

export default getRole;
