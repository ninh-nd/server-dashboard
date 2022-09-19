import { ThirdParty } from '../../models/thirdParty.js';

async function getAll(req, res) {
  try {
    const thirdParties = await ThirdParty.find();
    return res.status(200).json(thirdParties);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function get(req, res) {
  try {
    const thirdParty = await ThirdParty.findById(req.params.id);
    return res.status(200).json(thirdParty);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function create(req, res) {
  try {
    const newThirdParty = new ThirdParty(req.body);
    await newThirdParty.save();
    return res.status(201).json(newThirdParty);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function update(req, res) {
  try {
    const updatedThirdParty = await ThirdParty.findByIdAndUpdate(
      req.params.id,
      req.body,

      { new: true },
    );
    return res.status(200).json(updatedThirdParty);
  } catch (error) {
    return res.status(500).json(error);
  }
}

async function remove(req, res) {
  ThirdParty.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!doc) {
      return res.status(404).json({
        message: 'ThirdParty not found',
      });
    }
    return res.status(200).json({
      message: 'ThirdParty deleted',
    });
  });
}

export {
  get,
  getAll,
  create,
  update,
  remove,
};
