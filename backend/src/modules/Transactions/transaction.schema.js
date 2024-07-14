import Joi from 'joi';
import { ValidationHelper } from '../../utils';

export const transfer = Joi.object({
    amount: ValidationHelper.numberCheck(),
    senderWalletId: ValidationHelper.stringCheck(),
    receiverWalletId: ValidationHelper.stringCheck(),
    receiverEmail: ValidationHelper.emailCheck(),
    narration: ValidationHelper.stringCheck()
});
