import { Response, Helpers } from '../../utils';
import TransactionServices from './transactions.service';

/**
 * controllers that contains methods for transaction management
 * @class TransactionController
 */
class TransactionController {
  static async getTransactions(req, res) {
    try {
      const transactions = await TransactionServices.getTransactions(req.userReference);
      return Response.info(res, 'Transactions fetched successfully!', 200, transactions);
    } catch (error) {
      console.log(error.message);
      return Response.error(res, error.message);
    }
  }

  static async createTransactions(req, res) {
    try {
      const transactions = await TransactionServices.getTransactions(req.userReference);
      return Response.info(res, 'Transactions fetched successfully!', 200, transactions);
    } catch (error) {
      console.log(error.message);
      return Response.error(res, error.message);
    }
  }
}

export default TransactionController;
