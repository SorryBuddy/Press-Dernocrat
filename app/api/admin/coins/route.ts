import { isAdminSession } from "@/lib/admin-session";
import { getSession } from "@/lib/auth/session";
import { addCoinsToUser, findUserById, toPublicUser } from "@/lib/auth/users";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = (await request.json()) as {
    userId?: string;
    amount?: number;
    target?: "self";
  };

  const amount = body.amount;
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Enter a positive coin amount." }, { status: 400 });
  }

  let userId = body.userId;
  if (body.target === "self") {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "No signed-in user for self grant." }, { status: 400 });
    }
    userId = session.userId;
  }

  if (!userId) {
    return NextResponse.json({ error: "User id required." }, { status: 400 });
  }

  const updated = await addCoinsToUser(userId, amount);
  if (!updated) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const stored = await findUserById(userId);
  return NextResponse.json({
    user: updated,
    message: `Added ${Math.floor(amount)} coins to ${stored?.name ?? "user"}.`,
  });
}
