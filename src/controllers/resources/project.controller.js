import { Project } from '../../models/project.js';
import { Member } from '../../models/member.js';
import { errorResponse, successResponse } from '../../utils/responseFormat.js';

async function get(req, res) {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName }).populate({
      path: 'phaseList',
      populate: {
        path: 'tasks',
      },
    });
    return res.status(200).json(successResponse(project, 'Project found'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function create(req, res) {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(successResponse(project, 'Project created'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function updateStatus(req, res) {
  try {
    const { projectName } = req.params;
    const { status } = req.body;
    const project = await Project.findOneAndUpdate(
      { name: projectName },
      { status },

      { new: true },
    );
    return res.status(200).json(successResponse(project, 'Project status updated'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function addPhaseToProject(req, res) {
  try {
    const { projectName } = req.params;
    const { phaseId } = req.body;
    const project = await Project.findOneAndUpdate(
      { name: projectName },
      {
        $addToSet: {
          phaseList: phaseId,
        },
      },
      { new: true },
    );
    return res.status(200).json(successResponse(project, 'Phase added to project'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function remove(req, res) {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    // Check if the project has just been created for 1 day
    if (project.createdAt.getTime() + 86400000 > Date.now()) {
      return res.status(403).json(errorResponse('Project cannot be deleted'));
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json(successResponse(project, 'Project deleted'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function getProjectMembers(req, res) {
  try {
    const { projectName } = req.params;
    const project = await Project.findOne({ name: projectName });
    if (!project) {
      return res.status(404).json(errorResponse('Project not found'));
    }
    const members = await Member.find({ projectId: project._id }).populate('activityHistory').populate('taskAssigned');
    return res.status(200).json(successResponse(members, 'Members found'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

export {
  get,
  create,
  updateStatus,
  addPhaseToProject,
  remove,
  getProjectMembers,
};
