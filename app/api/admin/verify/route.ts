import { ADMIN_ACCESS_CODE } from "@/lib/admin";
import { setAdminSession } from "@/lib/admin-session";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const code = (body.code ?? "").replace(/\D/g, "");

  if (code !== ADMIN_ACCESS_CODE) {
    return NextResponse.json({ error: "Invalid code." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
