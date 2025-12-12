"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "../lib/types";
import { clearStoredUser, getStoredUser } from "../lib/auth";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-lg bg-black px-3 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          : "rounded-lg border border-black/10 px-3 py-2 text-sm font-medium dark:border-white/10"
      }
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMe(getStoredUser());

    function onStorage(e: StorageEvent) {
      if (e.key === "newsportal.user" || e.key === null) {
        setMe(getStoredUser());
      }
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    clearStoredUser();
    setMe(null);
    router.push("/login");
  }

  return (
    <header className="border-b border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-sm font-semibold">
          News Portal
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink href="/login" label="Login" />
          <NavLink href="/news" label="News" />
          <NavLink href="/news/new" label="Create" />
        </nav>
        <div className="flex items-center gap-3">
          {mounted ? (
            <span className="hidden text-sm text-zinc-600 dark:text-zinc-300 sm:inline">
              {me ? `Logged in as: ${me.name}` : "Not logged in"}
            </span>
          ) : null}
          {me ? (
            <button
              className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium dark:border-white/10"
              onClick={logout}
            >
              Logout
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
