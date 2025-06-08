import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "@/lib/types";
import { createPaginationSelectors } from "./utils/pagination";
import { RootState } from "./store";

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

export const {
  setTransactions,
  setSearchTerm,
  setCurrentPage,
  addTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

const selectTransactionsState = (state: RootState) => ({
  items: state.transactions.transactions,
  searchTerm: state.transactions.searchTerm,
  currentPage: state.transactions.currentPage,
  itemsPerPage: state.transactions.itemsPerPage,
});

const {
  selectFilteredItems: selectFilteredTransactions,
  selectPaginatedItems: selectPaginatedTransactions,
  selectTotalPages: selectTransactionTotalPages,
  selectCurrentPage: selectTransactionCurrentPage,
} = createPaginationSelectors(
  selectTransactionsState,
  (txn, term) =>
    txn.description.toLowerCase().includes(term) ||
    txn.currency.toLowerCase().includes(term) ||
    txn.status.toLowerCase().includes(term)
);

export {
  selectFilteredTransactions,
  selectPaginatedTransactions,
  selectTransactionTotalPages,
  selectTransactionCurrentPage,
};
