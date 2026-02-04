import express from 'express';
import { addProjectMember, createProject, updateProject } from '../controllers/projectController';

const projectRouter = express.Router();

projectRouter.post('/', createProject);
projectRouter.put('/', updateProject);
projectRouter.post('/:projectId/addmember', addProjectMember);

export default projectRouter;