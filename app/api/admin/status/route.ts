import { isAdminSession } from "@/lib/admin-session";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ unlocked: await isAdminSession() });
}
