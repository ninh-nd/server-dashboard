import { ThirdParty } from '../models/thirdParty.js';

const thirdPartyController = {
  getAllThirdParty: async (req, res) => {
    try {
      const thirdParties = await ThirdParty.find();
      res.status(200).json(thirdParties);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getThirdParty: async (req, res) => {
    try {
      const thirdParty = await ThirdParty.findById(req.params.id);
      res.status(200).json(thirdParty);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  createThirdParty: async (req, res) => {
    try {
      const newThirdParty = new ThirdParty(req.body);
      await newThirdParty.save();
      res.status(201).json(newThirdParty);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateThirdParty: async (req, res) => {
    try {
      const updatedThirdParty = await ThirdParty.findByIdAndUpdate(
        req.params.id,
        req.body,

        { new: true },
      );
      res.status(200).json(updatedThirdParty);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteThirdParty: (req, res) => {
    ThirdParty.findByIdAndDelete(req.params.id, (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        res.status(404).json({
          message: 'ThirdParty not found',
        });
      } else {
        res.status(200).json({
          message: 'ThirdParty deleted',
        });
      }
    });
  },
};

export default thirdPartyController;
