import { NextApiRequest, NextApiResponse } from 'next';
import { Response, Helpers } from '../../lib';
import { Auth } from "../../middleware";
import WalletController from "./wallet.controller";

const { applyMiddleware } = Helpers;
const { verifyToken } = Auth;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') applyMiddleware(req, res, [verifyToken], WalletController.getWallet);
  else return Response.error(res, `Method ${req.method} Not Allowed`, 404);
}
