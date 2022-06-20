import { Project } from '../models/project.js';

const projectController = {
  getProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id).populate('phases');
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createProject: async (req, res) => {
    try {
      const project = await Project.create(req.body);
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateProjectStatus: async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(req.params.id, req.body.status);
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  addPhase: async (req, res) => {
    try {
      const project = await Project.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { phases: req.body.phaseId } },
      );
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteProject: async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        res.status(404).json({ message: 'Project not found' });
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
  },
};

export default projectController;
