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

const createTransaction = async (data) => {
    return db.collection('transactions').add(data);
};

const getUser = async(userId) => {
    return firebaseAdmin.getUser(userId);
}

const getUserWallets = async(userId) => {
    const walletsSnapshot = await db.collection('wallets').where('userId', '==', userId).get();
    if (walletsSnapshot.empty) return [];

    // Extract and return wallet data
    const wallets = walletsSnapshot.docs.map(doc => doc.data());
    return wallets;
}

const deleteUsers = async () => {
    const users = await firebaseAdmin.listUsers();
    const deleteUsersResult = await firebaseAdmin.deleteUsers(users.users.map(user => user.uid));
    return deleteUsersResult;
};

export {
    admin,
    createUser,
    getUser,
    createTransactionQueue,
    createTransaction,
    getUserWallets,
    deleteUsers,
}