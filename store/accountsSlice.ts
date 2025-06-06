import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const selectAccountsState = (state: { accounts: AccountsState }) => state.accounts;

export const selectFilteredAccounts = createSelector(
  [selectAccountsState],
  (accountsState) => {
    const term = accountsState.searchTerm.toLowerCase();
    if (!term) return accountsState.accounts;

    return accountsState.accounts.filter(({ name, ownerName, type, balance }) =>
      [name, ownerName, type, balance.toString()].some(field =>
        field.toLowerCase().includes(term)
      )
    );
  }
);

export const selectPaginatedAccounts = createSelector(
  [selectFilteredAccounts, selectAccountsState],
  (filteredAccounts, accountsState) => {
    const start = (accountsState.currentPage - 1) * accountsState.itemsPerPage;
    const end = start + accountsState.itemsPerPage;
    return filteredAccounts.slice(start, end);
  }
);

export const selectTotalPages = createSelector(
  [selectFilteredAccounts, selectAccountsState],
  (filteredAccounts, accountsState) =>
    Math.max(Math.ceil(filteredAccounts.length / accountsState.itemsPerPage), 1)
);

export const selectCurrentPage = createSelector(
  [selectAccountsState],
  (accountsState) => accountsState.currentPage
);

export default accountsSlice.reducer;
