import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Account } from "@/lib/types";
import { RootState } from "./store";
import { createPaginationSelectors } from "./utils/pagination";

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
  itemsPerPage: 5,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setAccounts(state, action: PayloadAction<Account[]>) {
      state.accounts = action.payload;
    },
    addAccount(state, action: PayloadAction<Account>) {
        state.accounts.unshift(action.payload);
    },
    updateAccountAction(state, action: PayloadAction<Account>) {
      const index = state.accounts.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
          state.accounts[index] = action.payload;
      }
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    removeAccount(state, action: PayloadAction<string>) {
      state.accounts = state.accounts.filter(account => account.id !== action.payload);
    },
  },
});

export const { setAccounts, setSearchTerm, setCurrentPage, addAccount, updateAccountAction, removeAccount } = accountsSlice.actions;

export const selectAccounts = (state: RootState) => state.accounts.accounts;

export const selectAccountsMap = createSelector(selectAccounts, (accounts) =>
  Object.fromEntries(accounts.map((account) => [account.id, account]))
);

export default accountsSlice.reducer;

const selectAccountsState = createSelector(
  (state: RootState) => state.accounts,
  (accountsState) => ({
    items: accountsState.accounts,
    searchTerm: accountsState.searchTerm,
    currentPage: accountsState.currentPage,
    itemsPerPage: accountsState.itemsPerPage,
  })
);

const {
  selectFilteredItems: selectFilteredAccounts,
  selectPaginatedItems: selectPaginatedAccounts,
  selectTotalPages: selectAccountTotalPages,
  selectCurrentPage: selectAccountCurrentPage,
} = createPaginationSelectors(
  selectAccountsState,
  (acc, term) =>
    [acc.name, acc.ownerName, acc.type, acc.balance.toString()].some((field) =>
      field.toLowerCase().includes(term)
    )
);

export {
  selectFilteredAccounts,
  selectPaginatedAccounts,
  selectAccountTotalPages,
  selectAccountCurrentPage,
};

export const selectFilteredAccountOptions = createSelector(
  [selectAccounts],
  (accounts) =>
    accounts.map((acc) => ({
      id: acc.id,
      name: acc.name,
      currency: acc.currency,
      ownerName: acc.ownerName,
      balance: acc.balance,
    }))
);