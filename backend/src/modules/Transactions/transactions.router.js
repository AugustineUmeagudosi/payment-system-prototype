import { Router } from 'express';
import TransactionController from './transactions.controller';

const router = Router();

router.get('/', TransactionController.getTransactions);
router.post('/', TransactionController.createTransactions);

export default router;
