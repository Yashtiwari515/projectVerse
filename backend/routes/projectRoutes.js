import express from 'express';
import { addProjectMember, createProject, updateProject } from '../controllers/projectController.js';

const projectRouter = express.Router();

projectRouter.post('/', createProject);
projectRouter.put('/:id', updateProject);
projectRouter.post('/:projectId/addmember', addProjectMember);

export default projectRouter;