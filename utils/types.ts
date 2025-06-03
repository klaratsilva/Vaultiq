export type AccountStatus = 'active' | 'suspended' | 'pending';
export type AccountType = 'personal' | 'business' | 'admin';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD';

type TransactionStatus = 'pending' | 'completed' | 'failed';

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

interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;          
  status: TransactionStatus;
  createdAt: string;  
  description: string      // ISO string timestamp
}