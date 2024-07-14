import Joi from 'joi';
import { ValidationHelper } from '../../utils';

export const register = Joi.object({
  name: ValidationHelper.stringCheck(),
  email: ValidationHelper.emailCheck(),
  password: ValidationHelper.passwordCheck(),
});

export const login = Joi.object({
  email: ValidationHelper.emailCheck(),
  password: ValidationHelper.passwordCheck(),
});
