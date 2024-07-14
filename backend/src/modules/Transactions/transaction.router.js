import { Router } from 'express';
import TransactionController from './transaction.controller';
import { ValidationMiddleware, Auth } from '../../middlewares';
import * as Schema from './transaction.schema';

const router = Router();
router.use(Auth.verifyToken);

router.get('/', TransactionController.getTransactions);
router.post('/', ValidationMiddleware.validate(Schema.transfer), TransactionController.transfer);

export default router;
