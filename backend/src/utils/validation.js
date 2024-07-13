import joi from 'joi';

/**
 * contains validation helpers
 *
 * @class ValidationHelper
 */
class ValidationHelper {
  /**
   * It validates a string.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static stringCheck(param, min = 1, max = 12000000) {
    return joi
      .string()
      .required()
      .trim()
      .min(min)
      .max(max)
      .messages({
        'any.required': `${param} is a required field`,
        'string.max': `${param} can not be greater than ${max} characters`,
        'string.min': `${param} can not be lesser than ${min} characters`,
        'string.base': `${param} must be a string`,
        'string.empty': `${param} cannot be an empty field`,
      });
  }

  /**
   * It validates an optional string.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static optionalStringCheck(param, min = 1, max = 12000000) {
    return joi.string().trim().min(min).max(max)
      .messages({
        'any.required': `${param} is a required field`,
        'string.max': `${param} can not be greater than ${max} characters`,
        'string.min': `${param} can not be lesser than ${min} characters`,
        'string.base': `${param} must be a string`,
        'string.empty': `${param} cannot be an empty field`,
      });
  }

  /**
   * It validates a date.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static dateCheck(param) {
    return joi
      .date()
      .required()
      .messages({
        'any.required': `${param} is a required field`,
        'date.base': `${param} must be a correct date`,
        'string.empty': `${param} cannot be an empty field`
      });
  }

  /**
   * It optionally validates a date.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static optionalDateCheck(param) {
    return joi
      .date()
      .messages({
        'date.base': `${param} must be a correct date`,
        'string.empty': `${param} cannot be an empty field`
      });
  }

  /**
   * It validates a phone number.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static phoneNumberCheck() {
    return joi.string().pattern(new RegExp(/^\+(?:\d ?){6,14}\d$/)).messages({
      'string.pattern.base':
        'Phone Number must be in international format eg +234...',
      'string.empty': 'Phone Number must not be an empty field',
      'any.required': 'Phone Number is a required field'
    });
  }

  /**
   * It validates a string is part of an enum.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static enumCheck(fields, param) {
    return joi
      .string()
      .required()
      .valid(...fields)
      .messages({
        'string.empty': `${param} must not be an empty field`,
        'any.required': `${param} is a required field`,
        'any.only': `${param} must be one of [${fields}]`
      });
  }

  /**
   * It optionally validates a string is part of an enum.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static optionalEnumCheck(fields, param) {
    return joi
      .string()
      .valid(...fields)
      .messages({
        'string.empty': `${param} must not be an empty field`,
        'any.only': `${param} must be one of [${fields}]`
      });
  }

  /**
   * It validates a email
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static emailCheck() {
    return joi.string().trim().email().lowercase()
      .required()
      .messages({
        'any.required': 'Email is a required field',
        'string.email': 'Email is not valid',
        'string.empty': 'Email cannot be an empty field'
      });
  }

  /**
   * It validates a password.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static passwordCheck() {
    return joi.string().trim().required().min(7)
      .messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password field cannot be an empty field',
        'any.required': 'Password field is required',
        'string.min': 'Password can not be lesser than 7 characters'
      });
  }

  /**
    * It validates a six digit otp.
    * @static
    * @memberof ValidationHelper
    * @returns {Boolean}
    */
  static otpNumberCheck(param) {
    return joi
      .string()
      .required()
      .pattern(new RegExp(/^\d{6}$/))
      .messages({
        'any.required': `${param} is a required field`,
        'string.base': `${param} must be a number`,
        'string.empty': `${param} cannot be an empty field`,
        'string.pattern.base':
          'Otp must be six digits',
      });
  }

  /**
   * validates a number.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static numberCheck(param, min = 1) {
    return joi
      .number()
      .required()
      .min(min)
      .messages({
        'any.required': `${param} is a required field`,
        'number.base': `${param} must be a number`,
        'number.empty': `${param} cannot be an empty field`,
        'number.min': `${param} can not be lesser than ${min}`
      });
  }

  /**
   * optionally validates a number.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static optionalNumberCheck(param, min = 1) {
    return joi
      .number()
      .min(min)
      .messages({
        'number.base': `${param} must be a number`,
        'number.empty': `${param} cannot be an empty field`,
        'number.min': `${param} can not be lesser than ${min}`
      });
  }

  /**
   * validates a url.
   * @static
   * @memberof ValidationHelper
   * @returns {Boolean}
   */
  static optionalUrlCheck(param, min = 1) {
    return joi.string().uri().messages({
      'string.min': `${param} can not be lesser than ${min} characters`,
      'string.base': `${param} must be a valid url`
    });
  }
}

export default ValidationHelper;
