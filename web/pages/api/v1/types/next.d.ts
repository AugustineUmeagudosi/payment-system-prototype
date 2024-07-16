import { NextApiRequest } from 'next';

export interface ExtendedNextApiRequest extends NextApiRequest {
  user?: {
    uid: string;
    [key: string]: any;
  };
}
