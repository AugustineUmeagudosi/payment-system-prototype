import { Response } from '../utils';

export const validate = (schema, type = 'body') => {
    return async (req, res, next) => {
      try {
        const data = type === 'query' ? req.query : req.body;
        await schema.validateAsync(data);
        next();
      } catch (error) {
        return Response.error(res, error.details[0].message, 400);
      }
    };
};
