import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { accountFormSchema } from "@/lib/utils"; // your Zod schema

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = accountFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { ownerEmail, ownerName, ...accountData } = validation.data;

    const balance =
      typeof accountData.balance === "string"
    ? parseFloat(accountData.balance)
    : accountData.balance;

    if (!ownerEmail || !ownerName) {
      return NextResponse.json(
        { error: "ownerEmail and ownerName required" },
        { status: 400 }
      );
    }

    // Check if user exists in json-server
    const userCheckResponse = await fetch(
      `${process.env.API_URL}/users?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const users = await userCheckResponse.json();

    let ownerId: string;

    if (users.length > 0) {
      ownerId = users[0].ownerId;
    } else {
      ownerId = uuidv4();

    // Create new user in json-server
      await fetch(`${process.env.API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail, ownerName, ownerId }),
      });
    }

    const newAccount = {
      ...accountData,
      balance,
      ownerEmail,
      ownerName,
      ownerId,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    const createAccountRes = await fetch(`${process.env.API_URL}/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAccount),
    });

    const createdAccount = await createAccountRes.json();

    return NextResponse.json(createdAccount, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
  try {
    const res = await fetch(`${process.env.API_URL}/accounts`);

    if (!res.ok) {
      return new Response("Failed to fetch", { status: 500 });
    }

    const accounts = await res.json();
    return Response.json(accounts);
  } catch (error) {
    return new Response("Failed to fetch", { status: 500 });
  }
}