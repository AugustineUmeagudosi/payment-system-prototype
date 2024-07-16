import * as FirebaseAdmin from '../firebaseAdmin';
import { TransactionQueueData } from '../../types/transaction.types';

export const transferCatalyst = async (): Promise<void> => {
  try {
    console.log('[x] chimoney transaction catalyst tiggered >>>>>>>>>>>>>>..');
    // Fetch pending withdrawal requests
    const transactions: TransactionQueueData[] = await FirebaseAdmin.getQueuedTransfers();
    if (!transactions.length) return;

    // using for loop so that transactions will be processed sequentially
    for (let i = 0; i < transactions.length; i++) {
      const {
        id: transactionQueueId,
        amount,
        senderWalletId,
        receiverWalletId
      } = transactions[i];

      const { formattedWallets } = await FirebaseAdmin.getWalletByIds([senderWalletId, receiverWalletId]); 

      if (!formattedWallets[senderWalletId]) {
        const data = { status: 'failed', reason: 'Invalid sender wallet' };
        await FirebaseAdmin.updateTransactionQueue(transactionQueueId, data);
      }
      else if (!formattedWallets[receiverWalletId]) {
        const data = { status: 'failed', reason: 'Invalid receiver wallet' };
        await FirebaseAdmin.updateTransactionQueue(transactionQueueId, data);
      }
      else if (Number(amount) > Number(formattedWallets[senderWalletId].balance)) {
        const data = { status: 'failed', reason: 'Insufficient funds' };
        await FirebaseAdmin.updateTransactionQueue(transactionQueueId, data);
      } 
      else await FirebaseAdmin.processTransfer(transactions[i]);
    }
  } catch (error) {
    console.error(`Error processing transfers: ${(error as Error).message}`);
  }
};