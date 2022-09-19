import { Project } from '../../models/project.js';
import { Member } from '../../models/member.js';

async function get(req, res) {
  try {
    const project = await Project.findById(req.params.id).populate({
      path: 'phaseList',
      populate: {
        path: 'tasks',
      },
    });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function create(req, res) {
  try {
    const project = await Project.create(req.body);
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function updateStatus(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body.status);
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function addPhaseToProject(req, res) {
  try {
    const { phaseId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: {
          phaseList: phaseId,
        },
      },
      { new: true },
    );
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function remove(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    // Check if the project has just been created for 1 day
    if (project.createdAt.getTime() + 86400000 > Date.now()) {
      return res.status(403).json({ message: "You can't delete a project that was created less than 24 hours ago" });
    }

    await Project.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function getProjectMembers(req, res) {
  try {
    const members = await Member.find({ projectIn: req.params.id }).populate('activityHistory').populate('account').populate('taskAssigned');
    return res.status(200).json(members);
  } catch (error) {
    return res.status(500).json(error);
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
