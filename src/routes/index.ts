import IndexController from '../controllers/indexController';
import asyncException from '../middlewares/asyncException';
import { Router } from 'express';

const indexRouter = Router();

indexRouter.get('/', asyncException(IndexController.index));

export default indexRouter;