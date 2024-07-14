import express from 'express';
import { Response } from '../src/utils';
import UserRouter from './modules/Users/user.router';
import TransactionsRouter from './modules/Transactions/transaction.router';

const router = express.Router();

router.use('/users', UserRouter);
router.use('/transactions', TransactionsRouter);

router.get('/', (req, res) => Response.info(res, 'Hello World', 200));
router.get('/healthcheck/ping', (req, res) => Response.info(res, 'PONG', 200));

export default router;
