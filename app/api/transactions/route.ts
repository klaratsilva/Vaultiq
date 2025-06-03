import { NextResponse } from "next/server";
import { convertCurrency, transactionSchema } from "@/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate incoming data
    const data = transactionSchema.parse(body);

    const { fromAccountId, toAccountId, amount } = data;

    // Fetch sender and receiver accounts
    const [fromRes, toRes] = await Promise.all([
      fetch(`${process.env.API_URL}/accounts/${fromAccountId}`),
      fetch(`${process.env.API_URL}/accounts/${toAccountId}`),
    ]);

    if (!fromRes.ok || !toRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch one or both accounts" },
        { status: 404 }
      );
    }

    const fromAccount = await fromRes.json();
    const toAccount = await toRes.json();

    const fromCurrency = fromAccount.currency;
    const toCurrency = toAccount.currency;

    // Sender's balance in sender's currency
    const fromBalance = parseFloat(fromAccount.balance);

    // Check sender balance for the original amount (already in sender's currency)
    if (fromBalance < amount) {
      return NextResponse.json(
        { error: "Insufficient funds in sender's account" },
        { status: 400 }
      );
    }

    const amountInReceiverCurrency = convertCurrency(amount, fromCurrency, toCurrency);

    const toBalance = parseFloat(toAccount.balance);

    const updatedFromBalance = (fromBalance - amount).toFixed(2);
    const updatedToBalance = (toBalance + amountInReceiverCurrency).toFixed(2);

    const [patchFromRes, patchToRes] = await Promise.all([
      fetch(`${process.env.API_URL}/accounts/${fromAccountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: updatedFromBalance }),
      }),
      fetch(`${process.env.API_URL}/accounts/${toAccountId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ balance: updatedToBalance }),
      }),
    ]);

    if (!patchFromRes.ok || !patchToRes.ok) {
      return NextResponse.json(
        { error: "Failed to update account balances" },
        { status: 500 }
      );
    }

    // Save the transaction itself (amount stored as sent, in sender currency)
    const saveTransactionRes = await fetch(`${process.env.API_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    });

    if (!saveTransactionRes.ok) {
      return NextResponse.json(
        { error: "Failed to save transaction" },
        { status: 500 }
      );
    }

    const savedTransaction = await saveTransactionRes.json();

    return NextResponse.json(savedTransaction, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
