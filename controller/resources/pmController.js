import { ProjectManager } from '../../models/projectManager.js';

const pmController = {
  getProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.findById(req.params.id);
      return res.status(200).json(pm);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  createProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.create(req.body);
      return res.status(201).json(pm);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  updateProjectManager: async (req, res) => {
    try {
      const pm = await ProjectManager.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json(pm);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  deleteProjectManager: (req, res) => {
    ProjectManager.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Project Manager not found',
        });
      }
      return res.status(200).json({
        message: 'Project Manager deleted',
      });
    });
  },
  addProjectOwn: async (req, res) => {
    try {
      const pm = await ProjectManager.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { projectOwn: req.body.projectId } },
        { new: true },
      );
      return res.status(200).json(pm);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
  getProjectOwn: async (req, res) => {
    try {
      const pm = await ProjectManager.findById(req.params.id).populate('projectOwn');
      return res.status(200).json({
        projects: pm.projectOwn,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};

export default pmController;
