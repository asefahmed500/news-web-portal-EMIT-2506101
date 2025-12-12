"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsItem, User } from "../../lib/types";
import { api } from "../../lib/api";
import { clearStoredUser, getStoredUser } from "../../lib/auth";

export default function NewsListPage() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMe(getStoredUser());
  }, []);

  async function load() {
    try {
      setLoading(true);
      const [u, n] = await Promise.all([api.listUsers(), api.listNews()]);
      setUsers(u);
      setNews(n);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const usersById = useMemo(() => {
    const map = new Map<number, User>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return news;
    return news.filter((n) => n.title.toLowerCase().includes(q));
  }, [news, query]);

  const sorted = useMemo(() => {
    return filtered.slice().sort((a, b) => b.id - a.id);
  }, [filtered]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(sorted.length / pageSize));
  }, [sorted.length, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), pageCount);
    const start = (safePage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, pageSize, pageCount]);

  async function onDelete(id: number) {
    if (!confirm("Delete this news item?")) return;
    try {
      await api.deleteNews(id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  function logout() {
    clearStoredUser();
    setMe(null);
    router.push("/login");
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">News</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Logged in as: {me ? me.name : "(not logged in)"}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/news/new"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
          >
            Create News
          </a>
          {me ? (
            <button
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
            >
              Login
            </a>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <input
          className="w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
          placeholder="Search by title (bonus)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          aria-label="Page size"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
        <button
          className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {!loading ? (
        <div className="mt-3 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            Showing {sorted.length === 0 ? 0 : (Math.min(page, pageCount) - 1) * pageSize + 1}-
            {Math.min(Math.min(page, pageCount) * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="rounded-lg border border-black/10 px-3 py-1.5 dark:border-white/10"
              onClick={() => setPage(1)}
              disabled={page <= 1}
            >
              First
            </button>
            <button
              className="rounded-lg border border-black/10 px-3 py-1.5 dark:border-white/10"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </button>
            <span>
              Page {Math.min(page, pageCount)} / {pageCount}
            </span>
            <button
              className="rounded-lg border border-black/10 px-3 py-1.5 dark:border-white/10"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page >= pageCount}
            >
              Next
            </button>
            <button
              className="rounded-lg border border-black/10 px-3 py-1.5 dark:border-white/10"
              onClick={() => setPage(pageCount)}
              disabled={page >= pageCount}
            >
              Last
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-3">
        {loading ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">No news found.</p>
        ) : (
          paged.map((item) => {
              const author = usersById.get(item.author_id);
              const canEdit = !!me && me.id === item.author_id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                        Author: {author ? author.name : `User #${item.author_id}`} • Comments: {item.comments?.length ?? 0}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
                        href={`/news/${item.id}`}
                      >
                        View
                      </a>
                      {canEdit ? (
                        <>
                          <a
                            className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
                            href={`/news/${item.id}/edit`}
                          >
                            Edit
                          </a>
                          <button
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200"
                            onClick={() => onDelete(item.id)}
                          >
                            Delete
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
