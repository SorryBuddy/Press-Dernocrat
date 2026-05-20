import { DEFAULT_COIN_BALANCE } from "@/lib/coins";
import { setSessionCookie } from "@/lib/auth/session";
import { createGuestUser, findGuestByDeviceId, toPublicUser } from "@/lib/auth/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { deviceId?: string; coins?: number };
    const deviceId = (body.deviceId ?? "").trim();

    if (!deviceId || deviceId.length < 8) {
      return NextResponse.json({ error: "Invalid device id." }, { status: 400 });
    }

    const initialCoins =
      typeof body.coins === "number" && Number.isFinite(body.coins) && body.coins >= 0
        ? Math.floor(body.coins)
        : DEFAULT_COIN_BALANCE;

    let user = await findGuestByDeviceId(deviceId);
    if (!user) {
      user = await createGuestUser(deviceId, initialCoins);
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ user: toPublicUser(user) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create guest session.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
