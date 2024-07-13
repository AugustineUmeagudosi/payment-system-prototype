import { Response, Helpers } from '../utils';
import { admin } from '../../config/firebase';
import UserServices from '../modules/Users/users.service'; 

export const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) return Response.error(res, 'Kindly login to continue', 401);

    const token = authorization.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token); 

    const user = await UserServices.getUser(decoded.uid);
    if (!user) return Response.error(res, 'Invalid user', 401);

    req.user = user;
    next();
  } catch (error) {
    return Response.error(res, error.message);
  }
};