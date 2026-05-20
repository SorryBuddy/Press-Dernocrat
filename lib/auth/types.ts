export type PublicUser = {
  id: string;
  email: string;
  name: string;
  coins: number;
};

export type StoredUser = PublicUser & {
  passwordHash: string;
  createdAt: string;
  isGuest?: boolean;
};

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
};
