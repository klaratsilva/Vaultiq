import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "@/lib/types";

interface AccountsState {
  accounts: Account[];
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: AccountsState = {
  accounts: [],
  searchTerm: "",
  currentPage: 1,
  itemsPerPage: 6,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) {
      state.accounts = action.payload;
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

export const { setAccounts, setSearchTerm, setCurrentPage } = accountsSlice.actions;

export const selectFilteredAccounts = (state: { accounts: AccountsState }) => {
  if (!state.accounts.searchTerm) return state.accounts.accounts;

  const term = state.accounts.searchTerm.toLowerCase();
  return state.accounts.accounts.filter(({ name, ownerName, type, balance }) =>
    [name, ownerName, type, balance.toString()].some((field) =>
      field.toLowerCase().includes(term)
    )
  );
};

export const selectPaginatedAccounts = (state: { accounts: AccountsState }) => {
  const filtered = selectFilteredAccounts(state);
  const start = (state.accounts.currentPage - 1) * state.accounts.itemsPerPage;
  const end = start + state.accounts.itemsPerPage;
  return filtered.slice(start, end);
};

export const selectTotalPages = (state: { accounts: AccountsState }) => {
  const filtered = selectFilteredAccounts(state);
  return Math.max(Math.ceil(filtered.length / state.accounts.itemsPerPage), 1);
};

export const selectCurrentPage = (state: { accounts: AccountsState }) => state.accounts.currentPage;

export default accountsSlice.reducer;
