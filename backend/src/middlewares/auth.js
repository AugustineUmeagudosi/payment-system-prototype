import { Response } from '../utils';
import { admin, getUser } from '../../config/firebase';

export const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      return Response.error(res, 'Kindly login to continue', 401);
    }

    const token = authorization.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // get user from firestore
    req.user = await getUser(decoded.user_id);
    next();
  } catch (error) {
    const code = error.code === 'auth/id-token-expired' ? 401 : 500;
    const message = error.code === 'auth/id-token-expired' 
      ? 'invalid or expired token'
      : error.message;

    return Response.error(res, message, code);
  }
};
