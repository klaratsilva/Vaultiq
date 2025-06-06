export const accountTypes = ['personal', 'business', 'admin'] as const;
export const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'] as const;

export type AccountType = typeof accountTypes[number];
export type Currency = typeof currencies[number];

export type TransactionStatus = "active" | "inactive" | "pending" | "suspended" | "default";

export interface Account {
  id: string;                
  name: string;
  type: AccountType;
  currency: Currency;
  ownerId: string;           
  ownerEmail: string;           
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
export type CreateAccountPayload = Omit<Account, 'id' | 'createdAt'>;
export type UpdateAccountPayload = Partial<Omit<Account, 'createdAt'>> & { id: string };


export type SidebarItem = {
  imgURL: string;
  route: string;
  labelKey: string;
};