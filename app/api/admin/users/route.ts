import { isAdminSession } from "@/lib/admin-session";
import { listAllUsers } from "@/lib/auth/users";
import { NextResponse } from "next/server";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const users = await listAllUsers();
  return NextResponse.json({ users });
}
