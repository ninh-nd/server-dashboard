import express from 'express';
import githubController from '../controller/githubController.js';

const router = express.Router();
// Get Github config based on project id
router.get('/:id', githubController.getGithubConfig);
// Create a new Github config
router.post('/', githubController.createGithubConfig);
// Update a Github config
router.patch('/:id', githubController.updateGithubConfig);