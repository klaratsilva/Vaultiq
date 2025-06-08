import { CreateTransactionPayload, Transaction } from "./types";
import { accountFormSchema, API_URL, transactionSchema } from "./utils";
import { z } from "zod";

export async function getAccountById(id: string) {
  try {
    const apiUrl = `${API_URL}/accounts/${id}`; // Backend, not the frontend
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) return null;

    const account = await res.json();
    return account;
  } catch (error) {
    console.error("Failed to fetch account:", error);
    return null;
  }
}

export async function deleteAccount(id: string) {
  try {
    const apiUrl = `http://localhost:3000/api/accounts/${id}`;
    const res = await fetch(apiUrl, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete account");
    }

    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    return false;
  }
}

export async function getAllAccounts() {
  try {
    const apiUrl = `${API_URL}/accounts`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch accounts");

    return await res.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function getAllAccountsApi() {
  try {
    const apiUrl = `http://localhost:3000/api/accounts`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch accounts");

    return await res.json();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
}

export async function getAllTransactions() {
  try {
    const apiUrl = `${API_URL}/transactions`; 
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch transactions");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function createTransaction(
  data: CreateTransactionPayload
): Promise<Transaction>  {
  try {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }

    return await res.json();
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const apiUrl = `${API_URL}/users`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch users");

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}


export async function createAccount(data: z.infer<typeof accountFormSchema>) {
  try {
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create account");
    }

    return await res.json(); 
  } catch (error) {
    console.error("createAccount API error:", error);
    throw error;
  }
}

export async function updateAccount(id: string, data: z.infer<typeof accountFormSchema>) {
  try {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update account");
    }

    return await res.json();
  } catch (error) {
    console.error("updateAccount API error:", error);
    throw error;
  }
}
