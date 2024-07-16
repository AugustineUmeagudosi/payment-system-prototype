import { NextApiRequest, NextApiResponse } from 'next';
import { Response, Firebase } from '../lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return Response.error(res, `Method ${req.method} Not Allowed`, 404);
  try {
    const { email, password, name } = req.body;
    const user = await Firebase.login({ email, password });

    return Response.info(res, 'Login successful!', 200, user);
  } catch (error: any) {
    console.log(`An error occurred on the register user endpoint: ${error.message}`);
    return Response.error(res, 'Invalid credentials', 400);
  }
}
