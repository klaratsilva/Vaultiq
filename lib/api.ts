import { transactionSchema } from "./utils";
import { z } from "zod";

export async function getAccountById(id: string) {
  try {
    const apiUrl = `${process.env.API_URL}/accounts/${id}`; // Backend, not the frontend
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
    const apiUrl = `${process.env.API_URL}/accounts/${id}`;
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
    const apiUrl = `${process.env.API_URL}/accounts`;
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
    const apiUrl = `${process.env.API_URL}/transactions`; // use env for flexibility
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

export async function createTransaction(data: z.infer<typeof transactionSchema>): Promise<z.infer<typeof transactionSchema>> {
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
    const apiUrl = `${process.env.API_URL}/users`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch users");

    return await res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
