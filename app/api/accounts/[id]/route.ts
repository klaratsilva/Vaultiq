import { API_URL } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = await params.id;

  const response = await fetch(`${API_URL}/accounts/${id}`);

  if (!response.ok) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const account = await response.json();
  return NextResponse.json(account);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const incomingData = await request.json();

  // 🔍 Step 1: Fetch the existing account from the API
  const existingRes = await fetch(`${API_URL}/accounts/${id}`);

  if (!existingRes.ok) {
    return NextResponse.json({ error: "Failed to fetch existing account" }, { status: 404 });
  }

  const existingAccount = await existingRes.json();


  const updatedPayload = {
    ...existingAccount,
    ...incomingData, 
  };

  const updateRes = await fetch(`${API_URL}/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedPayload),
  });

  if (!updateRes.ok) {
    const errorData = await updateRes.json().catch(() => ({}));
    return NextResponse.json({ error: errorData?.message || "Failed to update account" }, { status: 500 });
  }

  const updatedAccount = await updateRes.json();
  return NextResponse.json(updatedAccount);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_URL}/accounts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend delete error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to delete account" },
        { status: res.status }
      );
    }

    return NextResponse.json({ message: "Account deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}