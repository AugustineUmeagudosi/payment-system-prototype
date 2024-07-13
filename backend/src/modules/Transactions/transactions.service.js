/**
 * Contains a collection of service methods for managing transaction resources on the app.
 * @class TransactionServices
 */
export default class TransactionServices {
  /**
   * Fetches a user's transactions using their userReference
   * @memberof TransactionServices
   * @param {string} userReference - user reference
   * @returns { Promise<Object | Error> } A promise that resolves or rejects
   * with an array of transactions resource or a DB Error.
   */
  static async getTransactions(userReference) {
    //
  }

  /**
   * Creates a transaction
   * @memberof TransactionServices
   * @param {object} data - transaction details
   * @returns { Promise<Object | Error> } A promise that resolves or rejects
   * with an object of the created transaction or a DB Error.
   */
  static async createTransaction(data) {
    //
  }
}
