import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

export interface Account {
  id: number;
  ownerId: number;
  currency: string;
  balance: number;
}

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

const initialState: AccountsState = {
  accounts: [],
  loading: false,
  error: null,
};

// Example async thunk to fetch accounts from mock API
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async () => {
    const res = await fetch('http://localhost:4000/accounts');
    if (!res.ok) throw new Error('Failed to fetch accounts');
    return (await res.json()) as Account[];
  }
);

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<Account>) {
      state.accounts.push(action.payload);
    },
    updateAccount(state, action: PayloadAction<Account>) {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.accounts[index] = action.payload;
      }
    },
    deleteAccount(state, action: PayloadAction<number>) {
      state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
    },
    transferFunds(
      state,
      action: PayloadAction<{ fromId: number; toId: number; amount: number }>
    ) {
      const { fromId, toId, amount } = action.payload;
      const fromAccount = state.accounts.find(acc => acc.id === fromId);
      const toAccount = state.accounts.find(acc => acc.id === toId);

      if (!fromAccount || !toAccount) {
        state.error = 'Invalid account(s)';
        return;
      }
      if (fromAccount.balance < amount) {
        state.error = 'Insufficient funds';
        return;
      }

      // For simplicity, ignoring currency conversion here, handle it elsewhere
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAccounts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.accounts = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load accounts';
      });
  },
});

export const {
  addAccount,
  updateAccount,
  deleteAccount,
  transferFunds,
  clearError,
} = accountsSlice.actions;

export default accountsSlice.reducer;
