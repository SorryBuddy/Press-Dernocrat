import { getSession } from "@/lib/auth/session";
import { findUserById, updateUserCoins } from "@/lib/auth/users";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await findUserById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ coins: user.coins });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = (await request.json()) as { coins?: number };
  if (typeof body.coins !== "number" || !Number.isFinite(body.coins) || body.coins < 0) {
    return NextResponse.json({ error: "Invalid coin amount." }, { status: 400 });
  }

  const user = await updateUserCoins(session.userId, body.coins);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ coins: user.coins });
}
