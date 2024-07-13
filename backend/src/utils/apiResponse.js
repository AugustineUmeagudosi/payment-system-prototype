export const info = (res, message, code, data = []) => res.status(code).json({
  status: 'success',
  message,
  data,
});

export const error = (res, message, code = 500) => {
  let errorMessage = message;

  if (process.env.NODE_ENV === 'production' && code === 500) {
    errorMessage = 'Ops! something went wrong';
  }

  return res.status(code).json({
    status: 'error',
    message: errorMessage,
  })
};
