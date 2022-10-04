import { Phase } from '../../models/phase.js';
import { errorResponse, successResponse } from '../../utils/responseFormat.js';

async function get(req, res) {
  try {
    const phase = await Phase.findById(req.params.id);
    return res.status(200).json(successResponse(phase, 'Phase found'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function create(req, res) {
  try {
    const newPhase = new Phase(req.body);
    await newPhase.save();
    return res.status(201).json(successResponse(newPhase, 'Phase created'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function update(req, res) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(successResponse(updatedPhase, 'Phase updated'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

async function remove(req, res) {
  Phase.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(500).json(errorResponse('Internal server error'));
    }
    if (!doc) {
      return res.status(404).json(errorResponse('Phase not found'));
    }
    return res.status(200).json(successResponse(doc, 'Phase deleted'));
  });
}

async function addTaskToPhase(req, res) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { tasks: req.body.taskId } },

      { new: true },
    );
    return res.status(200).json(successResponse(updatedPhase, 'Task added to phase'));
  } catch (error) {
    return res.status(500).json(errorResponse('Internal server error'));
  }
}

export {
  get,
  create,
  update,
  remove,
  addTaskToPhase,
};
