import { Response } from '../../utils';
import * as FireBaseAdmin from '../../../config/firebase';

/**
 * controllers that contains methods for user account management
 * @class UserController
 */
class UserController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      const user = await FireBaseAdmin.createUser({ email, password, displayName: name });
      return Response.info(res, 'User created successfully!', 200, user);
    } catch (error) {
      console.log(`An error occured on the register user endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }

  static async getWallet(req, res) {
    try {
      const wallets = await FireBaseAdmin.getUserWallets(req.user.uid);
      return Response.info(res, 'wallet fetched successfully!', 200, wallets);
    } catch (error) {
      console.log(`An error occured on the get user wallet endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }
}

export default UserController;
