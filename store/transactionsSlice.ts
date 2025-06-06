import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/lib/types";

interface TransactionsState {
  transactions: Transaction[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: TransactionsState = {
  transactions: [],
  searchTerm: "",
  currentPage: 1,
  itemsPerPage: 7,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
      state.currentPage = 1;
      state.searchTerm = "";
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1; 
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
  },
});

export const selectFilteredTransactions = (state: { transactions: TransactionsState }) => {
  const term = state.transactions.searchTerm.toLowerCase();
  if (!term) return state.transactions.transactions;

  return state.transactions.transactions.filter(txn =>
    txn.description.toLowerCase().includes(term) ||
    txn.currency.toLowerCase().includes(term) ||
    txn.status.toLowerCase().includes(term)
  );
};

export const selectPaginatedTransactions = (state: { transactions: TransactionsState }) => {
  const filtered = selectFilteredTransactions(state);
  const start = (state.transactions.currentPage - 1) * state.transactions.itemsPerPage;
  const end = start + state.transactions.itemsPerPage;
  return filtered.slice(start, end);
};

export const selectTotalPages = (state: { transactions: TransactionsState }) => {
  const filtered = selectFilteredTransactions(state);
  return Math.max(Math.ceil(filtered.length / state.transactions.itemsPerPage), 1);
};

export const selectCurrentPage = (state: { transactions: TransactionsState }) => state.transactions.currentPage;

export const { setTransactions, setSearchTerm, setCurrentPage } = transactionsSlice.actions;

export default transactionsSlice.reducer;

