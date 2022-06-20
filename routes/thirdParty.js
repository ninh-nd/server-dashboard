import express from 'express';
import thirdPartyController from '../controller/thirdPartyController.js';

const router = express.Router();

// Get all third parties
router.get('/', thirdPartyController.getAllThirdParty);
// Get a third party
router.get('/:id', thirdPartyController.getThirdParty);
// Create a new third party
router.post('/', thirdPartyController.createThirdParty);
// Update a third party
router.patch('/:id', thirdPartyController.updateThirdParty);
// Delete a third party
router.delete('/:id', thirdPartyController.deleteThirdParty);

export default router;
