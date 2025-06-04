// store/slices/transactionsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Transaction } from "@/utils/types";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async () => {
    const res = await fetch("/api/transactions");
    if (!res.ok) throw new Error("Failed to fetch transactions");
    return res.json() as Promise<Transaction[]>;
  }
);

interface TransactionsState {
  list: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  list: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading transactions";
      });
  },
});

export default transactionsSlice.reducer;