import { Phase } from '../../models/phase.js';

async function get(req, res) {
  try {
    const phase = await Phase.findById(req.params.id);
    return res.status(200).json(phase);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function create(req, res) {
  try {
    const newPhase = new Phase(req.body);
    await newPhase.save();
    return res.status(201).json(newPhase);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function update(req, res) {
  try {
    const updatedPhase = await Phase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.status(200).json(updatedPhase);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function remove(req, res) {
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
}

async function addTaskToPhase(req, res) {
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
}

export {
  get,
  create,
  update,
  remove,
  addTaskToPhase,
};
