import { DEFAULT_COIN_BALANCE } from "@/lib/coins";
import type { PublicUser, StoredUser } from "@/lib/auth/types";
import { hashPassword } from "@/lib/auth/password";
import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

async function ensureUsersFile(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  try {
    await readFile(USERS_FILE, "utf8");
  } catch {
    await writeFile(USERS_FILE, "[]", "utf8");
  }
}

async function readAllUsers(): Promise<StoredUser[]> {
  await ensureUsersFile();
  const raw = await readFile(USERS_FILE, "utf8");
  const parsed = JSON.parse(raw) as StoredUser[];
  return Array.isArray(parsed) ? parsed : [];
}

async function writeAllUsers(users: StoredUser[]): Promise<void> {
  await ensureUsersFile();
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    coins: user.coins,
  };
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  const users = await readAllUsers();
  return users.find((u) => u.email === normalized) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const users = await readAllUsers();
  return users.find((u) => u.id === id) ?? null;
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  initialCoins?: number;
}): Promise<StoredUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!email.includes("@")) {
    throw new Error("Please enter a valid email address.");
  }
  if (input.password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (name.length < 1) {
    throw new Error("Please enter your name.");
  }

  const users = await readAllUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: StoredUser = {
    id: randomUUID(),
    email,
    name,
    passwordHash: await hashPassword(input.password),
    coins: input.initialCoins ?? DEFAULT_COIN_BALANCE,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeAllUsers(users);
  return user;
}

export async function updateUserCoins(userId: string, coins: number): Promise<PublicUser | null> {
  const users = await readAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return null;

  users[index] = { ...users[index], coins: Math.max(0, Math.floor(coins)) };
  await writeAllUsers(users);
  return toPublicUser(users[index]);
}
