import { Member } from '../models/member.js';

const memberController = {
  getMember: async (req, res) => {
    try {
      const member = await Member.findById(req.params.id).populate('activityHistory');
      return res.status(200).json(member);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  createMember: async (req, res) => {
    try {
      const member = await Member.create(req.body);
      return res.status(201).json(member);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updateMember: async (req, res) => {
    try {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json(member);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deleteMember: (req, res) => {
    Member.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Member not found',
        });
      }
      return res.status(200).json({
        message: 'Member deleted',
      });
    });
  },
  assignTask: async (req, res) => {
    try {
      // Check if task has already been assigned
      const member = await Member.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { taskAssigned: req.body.taskId } },

        { new: true },
      );
      return res.status(200).json(member);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  addProject: async (req, res) => {
    try {
      // Check if project has already been added
      const member = await Member.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { projectParticipated: req.body.projectId } },
        { new: true },
      );
      return res.status(200).json(member);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default memberController;
