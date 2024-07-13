import { Sequelize, User } from "../../../models";

/**
 * Contains a collection of service methods for managing transaction resources on the app.
 * @class TransactionServices
 */
export default class TransactionServices {
  static async createUser(data) {
    const user = await User.create(data).catch((error) => {
      throw Error(error.message);
    });

    delete user.dataValues.id;
    delete user.dataValues.password;
    return user.dataValues;
  }

  static async getUser(firebaseId) {
    return User.findOne({ 
      where: { firebase_id: firebaseId },
      attributes: ['name', 'email', 'firebase_id', 'balance', 'createdAt']
    }).catch((error) => {
      throw Error(error.message);
    });
  }
}
