import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export interface TransactionQueueData extends firestore.DocumentData {
    id: string;
    amount: number;
    senderWalletId: string;
    receiverWalletId: string;
    narration: string;
    senderId: string;
    createdAt: Timestamp;
    status: 'queued' | 'failed' | 'processed';
}

export interface TransactionData extends firestore.DocumentData {
    id: string;
    amount: number;
    senderWalletId: string;
    receiverWalletId: string;
    narration: string;
    senderId: string;
    createdAt: Timestamp;
}