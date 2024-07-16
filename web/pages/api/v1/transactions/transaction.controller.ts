import { NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../types/next';
import { Response, Firebase } from "../lib";

/**
 * Controllers that contain methods for transaction management
 * @class TransactionController
 */
class TransactionController {
  static async transfer(req: ExtendedNextApiRequest, res: NextApiResponse) {
    try {
      const { user, body: { amount, senderWalletId, receiverWalletId, narration } } = req;

      const { formattedWallets } = await Firebase.getWalletByIds([senderWalletId, receiverWalletId]); 
      if (!formattedWallets[senderWalletId]) return Response.error(res, 'Invalid sender wallet', 400);
      if (!formattedWallets[receiverWalletId]) return Response.error(res, 'Invalid reciever wallet', 400);
      if(Number(amount) > Number(formattedWallets[senderWalletId].balance)) return Response.error(res, 'Insufficient funds', 400); // add charges to this later

      await Firebase.createTransactionQueue({
        amount,
        senderWalletId,
        receiverWalletId,
        narration,
        senderId: user?.uid as string,
        status: 'queued'
      });

      return Response.info(res, 'Transaction has been queued', 200);
    } catch (error: any) {
      console.log(error.message);
      return Response.error(res, error.message);
    }
  }

  static async getUserTransactions(req: ExtendedNextApiRequest, res: NextApiResponse) {
    try {
      const userId = req.user?.uid as string;

      const transactions = await Firebase.getUserTransactions(userId);
      return Response.info(res, 'Transactions fetched successfully!', 200, transactions);
    } catch (error: any) {
      console.log(`An error occured on the get user transactions endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }
}

export default TransactionController;
