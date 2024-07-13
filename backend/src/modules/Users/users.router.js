import { Router } from 'express';
import UserController from './users.controller';
import { ValidationMiddleware, Auth } from '../../middlewares';
import * as Schema from './users.schema';

const router = Router();
const { validate } = ValidationMiddleware;
const { verifyToken } = Auth;

router.post('/register', validate(Schema.register), UserController.register);
router.post('/login', validate(Schema.login), UserController.login);
router.get('/profile', verifyToken, UserController.getProfile);
// reset password

export default router;
