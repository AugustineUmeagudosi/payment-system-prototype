import { Timestamp } from "firebase-admin/firestore";

export interface LoginParams {
    email: string;
    password: string;
}
  
export interface CreateUserParams {
    email: string;
    password: string;
    displayName: string;
}
  
export interface TransactionData {
    id: string;
    amount: number;
    senderWalletId: string;
    receiverWalletId: string;
    receiverEmail: string;
    narration: string;
    senderId: string;
    createdAt?: Timestamp
}
  