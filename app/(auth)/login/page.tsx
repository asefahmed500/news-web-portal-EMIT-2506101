"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "../../lib/types";
import { api } from "../../lib/api";
import { setStoredUser } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedId, setSelectedId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await api.listUsers();
        if (!cancelled) setUsers(list);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load users");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedUser = useMemo(() => {
    if (selectedId === "") return null;
    return users.find((u) => u.id === selectedId) ?? null;
  }, [selectedId, users]);

  function onLogin() {
    if (!selectedUser) return;
    setStoredUser(selectedUser);
    router.push("/news");
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
        <h1 className="text-xl font-semibold">Login (Simulated)</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Select a user. We store it in localStorage.
        </p>

        {error ? (
          <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-3">
          <label className="text-sm font-medium">User</label>
          <select
            className="w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value ? Number(e.target.value) : "")}
            disabled={loading}
          >
            <option value="">Select a user...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>

          <button
            className="mt-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
            onClick={onLogin}
            disabled={!selectedUser}
          >
            Continue
          </button>

          <a className="text-sm underline opacity-80" href="/news">
            Continue without login (read-only)
          </a>
        </div>
      </div>
    </div>
  );
}
