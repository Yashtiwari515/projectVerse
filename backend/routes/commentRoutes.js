import express from 'express';
import { addComment, getTaskComments } from '../controllers/commentController.js';

const commentRouter = express.Router();

commentRouter.post('/:taskId', addComment);
commentRouter.get('/:taskId', getTaskComments);

export default commentRouter;

