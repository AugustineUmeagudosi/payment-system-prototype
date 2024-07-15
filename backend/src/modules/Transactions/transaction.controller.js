import { Response } from '../../utils';
import * as FirebaseAdmin from '../../../config/firebase';

/**
 * controllers that contains methods for transaction management
 * @class TransactionController
 */
class TransactionController {
  static async getTransactions(req, res) {
    try {
      const transactions = await FirebaseAdmin.getUserTransactions(req.user.uid);
      return Response.info(res, 'Transactions fetched successfully!', 200, transactions);
    } catch (error) {
      console.log(`An error occured on the get user transactions endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }

  static async transfer(req, res) {
    try {
      const { user, body: { amount, senderWalletId, receiverWalletId, receiverEmail, narration } } = req;

      // check if wallets exist
      const { formattedWallets } = await FirebaseAdmin.getWalletByIds([senderWalletId, receiverWalletId]); 
      if (!formattedWallets[senderWalletId]) return Response.error(res, 'Invalid sender wallet', 400);
      if (!formattedWallets[receiverWalletId]) return Response.error(res, 'Invalid reciever wallet', 400);
      if(Number(amount) > Number(formattedWallets[senderWalletId].balance)) return Response.error(res, 'Insufficient funds', 400); // add charges to this later

      await FirebaseAdmin.createTransactionQueue({
        amount,
        senderWalletId,
        receiverWalletId,
        receiverEmail,
        narration,
        senderId: user.uid,
        status: 'queued'
      });

      return Response.info(res, 'Transaction has been queued', 200);
    } catch (error) {
      console.log(error.message);
      return Response.error(res, error.message);
    }
  }
}

export default TransactionController;
