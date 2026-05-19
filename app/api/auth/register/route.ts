import { setSessionCookie } from "@/lib/auth/session";
import { createUser, toPublicUser } from "@/lib/auth/users";
import { DEFAULT_COIN_BALANCE } from "@/lib/coins";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      name?: string;
      coins?: number;
    };

    const email = body.email ?? "";
    const password = body.password ?? "";
    const name = body.name ?? "";

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
    }

    const initialCoins =
      typeof body.coins === "number" && Number.isFinite(body.coins) && body.coins >= 0
        ? Math.floor(body.coins)
        : DEFAULT_COIN_BALANCE;

    const user = await createUser({ email, password, name, initialCoins });
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
