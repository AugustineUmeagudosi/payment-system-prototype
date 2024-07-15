import admin from 'firebase-admin';
import serviceAccount from '../firebase-key.json';

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const firebaseAdmin = admin.auth();

const createUser = async ({ email, password, displayName }) => {
    const user = await admin.auth().createUser({ email, password, displayName });
    const wallet = await db.collection('wallets').add({ balance: 0, currency: 'NGN', userId: user.uid });
    return { user, wallet };
};

const createTransactionQueue = async (data) => {
    return db.collection('transactionQueues').add(data);
};

const updateTransactionQueue = async (id, data) => {
    return db.collection('transactionQueues').doc(id).update(data);
};

const getQueuedTransfers = async() => {
    const transactionSnapshots = await db.collection('transactionQueues').where('status', '==', 'queued').get();
    if (transactionSnapshots.empty) return [];

    // Extract and return wallet data
    const transactions = transactionSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return transactions;
}

const processTransfer = async (data) => {
    const {
        id: transactionQueueId,
        amount,
        senderWalletId,
        receiverWalletId,
        receiverEmail,
        narration,
        senderId,
    } = data;

    await db.runTransaction(async (t) => {
        // Get sender wallet
        const senderWalletRef = db.collection('wallets').doc(senderWalletId);
        const senderWalletDoc = await t.get(senderWalletRef);
        const senderWalletData = senderWalletDoc.data();

        // Get recipient wallet
        const recipientWalletRef = db.collection('wallets').doc(receiverWalletId);
        const recipientWalletDoc = await t.get(recipientWalletRef);
        const recipientWalletData = recipientWalletDoc.data();

        // Debit sender wallet
        t.update(senderWalletRef, { balance: senderWalletData.balance - amount });

        // Credit recipient wallet
        t.update(recipientWalletRef, { balance: recipientWalletData.balance + amount });

        // Create transaction record
        t.set(db.collection('transactions').doc(), {
            senderWalletId,
            amount,
            receiverWalletId,
            receiverEmail,
            narration,
            senderId,
            receiverId: recipientWalletData.userId,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

        // Update transaction queue status to 'processed'
        t.update(db.collection('transactionQueues').doc(transactionQueueId), { status: 'processed' });
    });
};

const getUserTransactions = async(userId) => {
    const transactionSnapshot = await db.collection('transactions').where('userId', '==', userId).get();
    if (transactionSnapshot.empty) return [];

    // Extract and return wallet data
    const transactions = transactionSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return transactions;
}

const getOneTransaction = async(transactionId) => {
    const transactionSnaphot = await db.collection('transactions').doc(transactionId).get();
    return transactionSnaphot.data();
}

const getUser = async(userId) => {
    return firebaseAdmin.getUser(userId);
}

const getUserWallets = async(userId) => {
    const walletsSnapshot = await db.collection('wallets').where('userId', '==', userId).get();
    if (walletsSnapshot.empty) return [];

    // Extract and return wallet data
    const wallets = walletsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return wallets;
}

const getWalletByIds = async(walletIds) => {
    const walletRefs = walletIds.map(id => db.collection('wallets').doc(id));
        
    const walletDocs = await db.getAll(...walletRefs);
    const formattedWallets = {};
    const wallets = [];
    walletDocs.map(doc => {
        if(doc.exists) {
            formattedWallets[doc.id] = { id: doc.id, ...doc.data() };
            wallets.push({ id: doc.id, ...doc.data() })
        }
    });
    return { wallets, formattedWallets };
}

export {
    admin,
    createUser,
    getUser,
    createTransactionQueue,
    updateTransactionQueue,
    getQueuedTransfers,
    processTransfer,
    getUserTransactions,
    getUserWallets,
    getOneTransaction,
    getWalletByIds,
}