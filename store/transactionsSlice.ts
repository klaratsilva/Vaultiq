import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
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
  itemsPerPage: 5,
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
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload);
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

const selectTransactionsState = (state: { transactions: TransactionsState }) =>
  state.transactions;

export const selectFilteredTransactions = createSelector(
  [selectTransactionsState],
  (transactionsState) => {
    const term = transactionsState.searchTerm.toLowerCase();
    if (!term) return transactionsState.transactions;

    return transactionsState.transactions.filter(
      (txn) =>
        txn.description.toLowerCase().includes(term) ||
        txn.currency.toLowerCase().includes(term) ||
        txn.status.toLowerCase().includes(term)
    );
  }
);

export const selectPaginatedTransactions = createSelector(
  [selectFilteredTransactions, selectTransactionsState],
  (filtered, transactionsState) => {
    const start =
      (transactionsState.currentPage - 1) * transactionsState.itemsPerPage;
    const end = start + transactionsState.itemsPerPage;
    return filtered.slice(start, end);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredTransactions, selectTransactionsState],
  (filtered, transactionsState) =>
    Math.max(Math.ceil(filtered.length / transactionsState.itemsPerPage), 1)
);

export const selectCurrentPage = createSelector(
  [selectTransactionsState],
  (transactionsState) => transactionsState.currentPage
);

export const {
  setTransactions,
  setSearchTerm,
  setCurrentPage,
  addTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
