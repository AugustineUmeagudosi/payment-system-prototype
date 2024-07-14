import { Router } from 'express';
import UserController from './user.controller';
import { ValidationMiddleware, Auth } from '../../middlewares';
import * as Schema from './user.schema';

const router = Router();

router.post('/register', ValidationMiddleware.validate(Schema.register), UserController.register);
router.get('/wallet', Auth.verifyToken, UserController.getWallet);

export default router;
