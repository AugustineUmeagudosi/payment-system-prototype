import { NextApiRequest, NextApiResponse } from 'next';
import { Response } from '../lib';
import { admin, getUser } from '../lib/firebaseAdmin';
import { ExtendedNextApiRequest } from '../types/next';

export const verifyToken = async (
  req: ExtendedNextApiRequest, 
  res: NextApiResponse, 
  next: () => void
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
      return Response.error(res, 'Kindly login to continue', 401);
    }

    const token = authorization.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // Get user from Firestore
    req.user = await getUser(decoded.user_id);
    next();
  } catch (error: any) {
    const code = error.code === 'auth/id-token-expired' ? 401 : 500;
    const message = error.code === 'auth/id-token-expired' 
      ? 'invalid or expired token'
      : error.message;

    return Response.error(res, message, code);
  }
};
