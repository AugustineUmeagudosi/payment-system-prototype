import admin, { firestore } from 'firebase-admin';
import * as firebase from 'firebase/app';
import serviceAccount from '../firebase-key.json';
import { signInWithEmailAndPassword, getAuth, sendEmailVerification, User } from 'firebase/auth';
import { LoginParams, CreateUserParams } from '../types/user.types';
import { TransactionQueueData, TransactionData } from '../types/transaction.types';

interface ExtendedUser extends User {
  stsTokenManager: {
    accessToken: string;
    refreshToken: string;
    expirationTime: number;
  };
}

// Initialize Firebase app for client-side
if (!firebase.getApps().length) {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
  });
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  });
}

const auth = getAuth();
const db = firestore();
const firebaseAdmin = admin.auth();

const login = async ({ email, password }: LoginParams): Promise<Partial<ExtendedUser>> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);

  if(user.emailVerified === false) await sendEmailVerification(auth.currentUser as User);

  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    ...(user as ExtendedUser).stsTokenManager,
  };
}

const createUser = async ({ email, password, displayName }: CreateUserParams): Promise<{ user: admin.auth.UserRecord, wallet: firestore.DocumentReference<firestore.DocumentData> } | any> => {
  const user = await admin.auth().createUser({ email, password, displayName });

  // initialize a wallet for the user
  await db.collection('wallets').add({
    balance: 0,
    currency: 'USD',
    userId: user.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  return {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
    disabled: user.disabled,
    wallets: await getUserWallets(user.uid)
  }
};

const createTransactionQueue = async (data: firestore.DocumentData): Promise<firestore.DocumentReference<firestore.DocumentData>> => {
  data.createdAt = admin.firestore.FieldValue.serverTimestamp();
  return db.collection('transactionQueues').add(data);
};

const updateTransactionQueue = async (id: string, data: any): Promise<any> => {
  data.updatedAt = admin.firestore.FieldValue.serverTimestamp()
  return db.collection('transactionQueues').doc(id).update(data);
};

const getQueuedTransfers = async (): Promise<TransactionQueueData[]> => {
  const transactionSnapshots = await db.collection('transactionQueues').where('status', '==', 'queued').get();
  if (transactionSnapshots.empty) return [];

  const transactions: TransactionQueueData[] = [];
  transactionSnapshots.docs.map(doc => { 
    const { amount, senderWalletId, receiverWalletId, receiverEmail, narration, senderId, status, createdAt } = doc.data()

    transactions.push({
      id: doc.id,
      amount, senderWalletId, receiverWalletId, receiverEmail, narration,
      senderId, status, createdAt
    })
  });

  return transactions;
}

const processTransfer = async (data: TransactionData): Promise<void> => {
  const {
    id: transactionQueueId,
    amount,
    senderWalletId,
    receiverWalletId,
    narration,
    senderId,
  } = data;

  await db.runTransaction(async (t) => {
    const senderWalletRef = db.collection('wallets').doc(senderWalletId);
    const senderWalletDoc = await t.get(senderWalletRef);
    const senderWalletData = senderWalletDoc.data() as { balance: number };

    const recipientWalletRef = db.collection('wallets').doc(receiverWalletId);
    const recipientWalletDoc = await t.get(recipientWalletRef);
    const recipientWalletData = recipientWalletDoc.data() as { balance: number, userId: string };

    t.update(senderWalletRef, { balance: senderWalletData.balance - amount, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    t.update(recipientWalletRef, { balance: recipientWalletData.balance + amount, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    t.set(db.collection('transactions').doc(), {
      senderWalletId,
      amount,
      receiverWalletId,
      narration,
      senderId,
      receiverId: recipientWalletData.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    t.update(db.collection('transactionQueues').doc(transactionQueueId), { status: 'processed', updatedAt: admin.firestore.FieldValue.serverTimestamp() });
  });
};

const getUserTransactions = async (userId: string): Promise<firestore.DocumentData[]> => {
  const [debit, credit] = await Promise.all([
    db.collection('transactions').where('senderId', '==', userId).get(),
    db.collection('transactions').where('recieverId', '==', userId).get()
  ]);
  if (debit.empty && credit.empty) return [];

  const debitTransactions = debit.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const creditTransactions = debit.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return [...debitTransactions, ...creditTransactions];
}

const getOneTransaction = async (transactionId: string): Promise<firestore.DocumentData | undefined> => {
  const transactionSnaphot = await db.collection('transactions').doc(transactionId).get();
  return transactionSnaphot.data();
}

const getUser = async (userId: string): Promise<admin.auth.UserRecord> => {
  return firebaseAdmin.getUser(userId);
}

const getUserWallets = async (userId: string): Promise<firestore.DocumentData[] | any> => {
  const walletsSnapshot = await db.collection('wallets').where('userId', '==', userId).get();
  if (walletsSnapshot.empty) return [];

  const wallets = walletsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return wallets;
}

const getWalletByIds = async (walletIds: string[]): Promise<{ wallets: firestore.DocumentData[], formattedWallets: Record<string, firestore.DocumentData> }> => {
  const walletRefs = walletIds.map(id => db.collection('wallets').doc(id));

  const walletDocs = await db.getAll(...walletRefs);
  const formattedWallets: Record<string, firestore.DocumentData> = {};
  const wallets: firestore.DocumentData[] = [];
  walletDocs.forEach(doc => {
    if (doc.exists) {
      formattedWallets[doc.id] = { id: doc.id, ...doc.data() };
      wallets.push({ id: doc.id, ...doc.data() });
    }
  });
  return { wallets, formattedWallets };
}

export {
  login,
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
