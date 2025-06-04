export async function getAccountById(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/accounts/${id}`, {
      // important for server-side fetch to always get fresh data
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const account = await res.json();
    return account;
  } catch (error) {
    console.error("Failed to fetch account:", error);
    return null;
  }
}