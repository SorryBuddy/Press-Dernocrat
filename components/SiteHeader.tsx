"use client";

import { LocalWeather } from "@/components/LocalWeather";
import { siteContainerClass } from "@/lib/site-layout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/risk-taking", label: "Risk Taking" },
  { href: "/credits", label: "Credits" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className={`relative flex items-center justify-between gap-4 py-2 pr-[5.5rem] ${siteContainerClass}`}>
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded hover:bg-neutral-100"
            aria-label="Open menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-5 bg-neutral-900" />
              <span className="block h-0.5 w-5 bg-neutral-900" />
              <span className="block h-0.5 w-5 bg-neutral-900" />
            </span>
          </button>
            <LocalWeather />
          </div>

          <p className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 text-center font-serif text-[10px] uppercase tracking-[0.2em] text-neutral-500 lg:block">
            Serving Sonoma County since yesterday
          </p>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              className="hidden items-center gap-1 rounded px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-100 sm:flex"
              aria-label="Account"
            >
              <UserIcon />
              <span className="text-xs">▼</span>
            </button>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded hover:bg-neutral-100"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </div>

        <div className={`border-t border-neutral-100 py-4 text-center sm:py-6 ${siteContainerClass}`}>
          <Link href="/">
            <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl md:text-5xl">
              Press Dernocrat Daily
            </h1>
            <p className="mt-1 font-sans text-sm text-neutral-600 sm:text-base">
              (a parody news source)
            </p>
          </Link>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40"
          aria-label="Close menu overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
          <p className="font-serif text-lg font-bold">Menu</p>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded text-2xl leading-none hover:bg-neutral-100"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`border-b border-neutral-100 py-4 font-sans text-lg font-semibold ${
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-[#c41230]"
                  : "text-neutral-900 hover:text-[#c41230]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto border-t border-neutral-200 p-4 text-xs text-neutral-500">
          Press Dernocrat Daily — not affiliated with any real newspaper,
          democracy, or homework deadline.
        </p>
      </aside>
    </>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" />
    </svg>
  );
}
