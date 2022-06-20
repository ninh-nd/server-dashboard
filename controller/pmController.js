import { ProjectManager } from '../models/projectManager.js';

const pmController = {
  getProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.findById(req.params.id);
      res.status(200).json(pm);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  createProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.create(req.body);
      res.status(201).json(pm);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(pm);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  deleteProjectManager: (req, res) => {
    ProjectManager.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        res.status(404).json({
          message: 'Project Manager not found',
        });
      } else {
        res.status(200).json({
          message: 'Project Manager deleted',
        });
      }
    });
  },
  addProjectOwn: async (req, res) => {
    try {
      const pm = await ProjectManager.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { projectsOwn: req.body.projectId } },
        { new: true },
      );
      res.status(200).json(pm);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

export default pmController;
