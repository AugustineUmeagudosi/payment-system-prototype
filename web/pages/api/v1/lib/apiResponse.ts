import { NextApiResponse } from 'next';

export const info = (res: NextApiResponse, message: string, code: number, data: any | any[] = []) => {
  return res.status(code).json({
    status: 'success',
    message,
    data,
  });
};

export const error = (res: NextApiResponse, message: string, code: number = 500) => {
  let errorMessage = message;

  if (process.env.NODE_ENV === 'production' && code === 500) {
    errorMessage = 'Ops! something went wrong';
  }

  return res.status(code).json({
    status: 'error',
    message: errorMessage,
  });
};
