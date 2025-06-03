// app/api/accounts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await request.json();

  // validate body...

  // call json-server or DB to update account
  const response = await fetch(`http://localhost:4000/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }

  const updatedAccount = await response.json();
  return NextResponse.json(updatedAccount);
}
