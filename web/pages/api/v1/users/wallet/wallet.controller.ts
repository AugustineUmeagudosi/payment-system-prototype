import { NextApiRequest, NextApiResponse } from 'next';
import { ExtendedNextApiRequest } from '../../types/next';
import { Response, Firebase } from "../../lib";

/**
 * Controllers that contain methods for wallet account management
 * @class WalletController
 */
class WalletController {
  static async getWallet(req: ExtendedNextApiRequest, res: NextApiResponse) {
    try {
      const userId = req.user?.uid as string;
      const wallets = await Firebase.getUserWallets(userId);
      return Response.info(res, 'Wallet fetched successfully!', 200, wallets);
    } catch (error: any) {
      console.log(`An error occurred on the get user wallet endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }
}

export default WalletController;
