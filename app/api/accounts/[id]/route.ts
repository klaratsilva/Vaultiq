// app/api/accounts/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = await params.id;

  const response = await fetch(`http://localhost:4000/accounts/${id}`);

  if (!response.ok) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const account = await response.json();
  return NextResponse.json(account);
}

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


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`http://localhost:4000/accounts/${params.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    return NextResponse.json({ message: "Account deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}