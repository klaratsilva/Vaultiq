export type AccountStatus = 'active' | 'suspended' | 'pending';
export type AccountType = 'personal' | 'business' | 'admin';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

export type TransactionStatus = "active" | "inactive" | "pending" | "suspended" | "default";

export interface Account {
  id: string;                // UUID
  name: string;
  type: AccountType;
  currency: Currency;
  ownerId: string;           // UUID of the owning user/contact
  ownerEmail: string;           // Optional
  ownerName: string;
  balance: string;     
}

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;        
  status: TransactionStatus;
  createdAt: string;  
  description: string;
  currency: Currency,
  targetCurrency: Currency,
  amount: number;   
  clientConvertedAmount: number,
}

export type CreateTransactionPayload = Omit<Transaction, "id" | "createdAt" | "status">;