import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { accountFormSchema } from "@/utils"; // your Zod schema

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate body using Zod schema
    const validation = accountFormSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { ownerEmail, ownerName, ...accountData } = validation.data;

    if (!ownerEmail || !ownerName) {
      return NextResponse.json(
        { error: "ownerEmail and ownerName required" },
        { status: 400 }
      );
    }

    // 1. Check if user exists in json-server
    const userCheckResponse = await fetch(
      `http://localhost:4000/users?ownerEmail=${encodeURIComponent(ownerEmail)}`
    );
    const users = await userCheckResponse.json();

    let ownerId: string;

    if (users.length > 0) {
      ownerId = users[0].ownerId;
    } else {
      ownerId = uuidv4();

      // Create new user in json-server
      await fetch(`http://localhost:4000/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail, ownerName, ownerId }),
      });
    }

    // 2. Create new account with ownerId
    const newAccount = {
      ...accountData,
      ownerEmail,
      ownerName,
      ownerId,
      id: uuidv4(),
    };

    const createAccountRes = await fetch(`http://localhost:4000/accounts`, {
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
