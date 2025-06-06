import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = await params.id;

  const response = await fetch(`${process.env.API_URL}/accounts/${id}`);

  if (!response.ok) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const account = await response.json();
  return NextResponse.json(account);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await request.json();

  const response = await fetch(`${process.env.API_URL}/accounts/${id}`, {
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


// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//     console.log("Deleting account id:", params.id);
//   try {
//     const res = await fetch(`${process.env.API_URL}/accounts/${params.id}`, {
//       method: "DELETE",
//     });

//     if (!res.ok) {
//       return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Account deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log("Delete request for id:", id);

  try {
    const res = await fetch(`${process.env.API_URL}/accounts/${id}`, {
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