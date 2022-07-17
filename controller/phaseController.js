import { Phase } from '../models/phase.js';

const phaseController = {
  getPhase: async (req, res) => {
    try {
      const phase = await Phase.findById(req.params.id);
      return res.status(200).json(phase);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  createPhase: async (req, res) => {
    try {
      const newPhase = new Phase(req.body);
      await newPhase.save();
      return res.status(201).json(newPhase);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  updatePhase: async (req, res) => {
    try {
      const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json(updatedPhase);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  deletePhase: (req, res) => {
    Phase.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (!doc) {
        return res.status(404).json({
          message: 'Phase not found',
        });
      }
      return res.status(200).json({
        message: 'Phase deleted',
      });
    });
  },
  addTask: async (req, res) => {
    try {
      const updatedPhase = await Phase.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { tasks: req.body.taskId } },

        { new: true },
      );
      return res.status(200).json(updatedPhase);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};

export default phaseController;
