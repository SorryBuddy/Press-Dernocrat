"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import type { Headline } from "@/lib/articles";

type Props = {
  headlines: Headline[];
};

export function LatestHeadlines({ headlines }: Props) {
  const { openAuth, user, logout } = useAuth();

  return (
    <aside className="w-full lg:w-96 lg:shrink-0 lg:sticky lg:top-6 lg:self-start">
      <h2 className="font-sans text-sm font-bold uppercase tracking-wide text-neutral-900">
        Latest Headlines
      </h2>
      <div className="mt-2 h-0.5 w-full bg-[#c41230]" />

      <ul className="mt-4 divide-y divide-neutral-200">
        {headlines.map((item) => (
          <li key={item.id} className="py-4 first:pt-0">
            <Link
              href={`/article/${item.id}`}
              className="font-sans text-[15px] font-bold leading-snug text-neutral-900 hover:text-[#c41230]"
            >
              {item.title}
            </Link>
            <p className="mt-1.5 font-sans text-[11px] uppercase tracking-wide text-neutral-500">
              {item.timeAgo}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 bg-neutral-100 p-5">
        <p className="font-sans text-sm font-bold text-neutral-900">
          {user ? `Signed in as ${user.name}` : "Create a free account"}
        </p>
        <p className="mt-2 font-sans text-xs leading-relaxed text-neutral-600">
          {user
            ? "Your coin balance is saved to your account on this site."
            : "Sign up to save your coin balance, play Risk Taking games, and come back anytime."}
        </p>
        {user ? (
          <button
            type="button"
            onClick={() => logout()}
            className="mt-4 w-full border border-neutral-300 bg-white px-4 py-3 font-sans text-sm font-bold uppercase tracking-wide text-neutral-800 hover:bg-neutral-50"
          >
            Log Out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => openAuth("signup")}
            className="mt-4 w-full bg-[#c41230] px-4 py-3 font-sans text-sm font-bold uppercase tracking-wide text-white hover:bg-[#a30f28]"
          >
            Sign Up
          </button>
        )}
      </div>
    </aside>
  );
}
