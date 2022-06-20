import { Member } from '../models/member.js';

const memberController = {
  getMember: async (req, res) => {
    try {
      const member = await Member.findById(req.params.id).populate('activityHistory');
      res.status(200).json(member);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createMember: async (req, res) => {
    try {
      const member = await Member.create(req.body);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateMember: async (req, res) => {
    try {
      const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(member);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteMember: (req, res) => {
    Member.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        res.status(404).json({
          message: 'Member not found',
        });
      } else {
        res.status(200).json({
          message: 'Member deleted',
        });
      }
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
      res.status(200).json(member);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

export default memberController;
