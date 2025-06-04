// store/accountsSlice.ts
import { Account } from "@/lib/types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async (_, thunkAPI) => {
    const res = await fetch(`${process.env.API_URL}/accounts`);
    if (!res.ok) throw new Error("Failed to fetch");
    return (await res.json()) as Account[];
  }
);

interface AccountsState {
  list: Account[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AccountsState = {
  list: [],
  status: "idle",
  error: null,
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export default accountsSlice.reducer;