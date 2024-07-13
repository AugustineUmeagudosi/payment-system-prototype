import { Response } from '../../utils';
import UserServices from './users.service';
import * as FireBaseAdmin from '../../../config/firebase';

const auth = FireBaseAdmin.getAuth();

/**
 * controllers that contains methods for user account management
 * @class UserController
 */
class UserController {
  static async register(req, res) {
    try {
      const { email, password, name: displayName } = req.body;

      const firebaseUser = await FireBaseAdmin.createUserWithEmailAndPassword(auth, email, password, displayName);
      if (!firebaseUser) return Response.error(res, 'Could not create user', 400);

      await FireBaseAdmin.sendEmailVerification(auth.currentUser);
      req.body.firebase_id = firebaseUser.user.uid;
      const user = await UserServices.createUser(req.body);

      const data = { ...user };
      data.auth_token = firebaseUser._tokenResponse.idToken;
      data.refresh_token = firebaseUser._tokenResponse.refreshToken;

      return Response.info(res, 'User created successfully!', 200, data);
    } catch (error) {
      console.log(`An error occured on the register user endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await FireBaseAdmin.signInWithEmailAndPassword(auth, email, password)

      const data = {
        firebase_id: user.user.uid,
        email: user.user.email,
        emailVerified: user.user.emailVerified,
        isAnonymous: user.user.isAnonymous,
        name: user._tokenResponse.displayName,
        ...user.user.stsTokenManager
      };

      return Response.info(res, 'User logged in successfully!', 200, data);
    } catch (error) {
      console.log(`An error occured on the get user profile endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }

  static async getProfile(req, res) {
    try {
      return Response.info(res, 'Profile fetched successfully!', 200, req.user);
    } catch (error) {
      console.log(`An error occured on the get user profile endpoint: ${error.message}`);
      return Response.error(res, error.message);
    }
  }
}

export default UserController;
