"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { NewsItem, User, Comment } from "../../../lib/types";
import { api } from "../../../lib/api";
import { getStoredUser } from "../../../lib/auth";
import { validateComment } from "../../../lib/validation";
import { nextId } from "../../../lib/id";

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [me, setMe] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [commentText, setCommentText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMe(getStoredUser());
  }, []);

  async function load() {
    try {
      setLoading(true);
      const [u, n] = await Promise.all([api.listUsers(), api.getNews(id)]);
      setUsers(u);
      setItem(n);
    } catch (e) {
      setErrors([e instanceof Error ? e.message : "Failed to load"]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const usersById = useMemo(() => {
    const map = new Map<number | string, User>();
    users.forEach((u) => map.set(u.id, u));
    return map;
  }, [users]);

  async function addComment() {
    setErrors([]);
    const e = validateComment(commentText);
    if (e.length) {
      setErrors(e);
      return;
    }
    if (!me) {
      setErrors(["Please login to comment."]);
      return;
    }
    if (!item) return;

    const existing = item.comments ?? [];
    const newComment: Comment = {
      id: nextId(existing),
      text: commentText.trim(),
      user_id: me.id,
      timestamp: new Date().toISOString(),
    };

    try {
      const updated = await api.patchNews(item.id, { comments: [...existing, newComment] });
      setItem(updated);
      setCommentText("");
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Failed to add comment"]);
    }
  }

  if (!id) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-sm">Invalid id.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-4 flex items-center justify-between">
        <a className="text-sm underline opacity-80" href="/news">
          ← Back
        </a>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Logged in as: {me ? me.name : "(not logged in)"}
        </p>
      </div>

      {errors.length ? (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
          <ul className="list-disc pl-5">
            {errors.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {loading ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading...</p>
      ) : !item ? (
        <p className="text-sm">Not found.</p>
      ) : (
        <>
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
            <h1 className="text-2xl font-semibold">{item.title}</h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Author: {usersById.get(item.author_id)?.name ?? `User #${item.author_id}`}
            </p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-7">{item.body}</p>
            {me && me.id === item.author_id ? (
              <div className="mt-5">
                <a
                  className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10"
                  href={`/news/${item.id}/edit`}
                >
                  Edit
                </a>
              </div>
            ) : null}
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
            <h2 className="text-lg font-semibold">Comments</h2>
            <div className="mt-4 grid gap-3">
              {(item.comments ?? []).length === 0 ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-300">No comments yet.</p>
              ) : (
                (item.comments ?? [])
                  .slice()
                  .sort((a, b) => {
                    const idA = Number(a.id);
                    const idB = Number(b.id);
                    if (Number.isFinite(idA) && Number.isFinite(idB)) return idA - idB;
                    return String(a.id).localeCompare(String(b.id));
                  })
                  .map((c) => (
                    <div key={c.id} className="rounded-xl border border-black/10 p-4 text-sm dark:border-white/10">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium">{usersById.get(c.user_id)?.name ?? `User #${c.user_id}`}</p>
                        <p className="text-xs text-zinc-500">{c.timestamp ? new Date(c.timestamp).toLocaleString() : ""}</p>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap">{c.text}</p>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold">Add Comment</h3>
              <textarea
                className="mt-2 min-h-[90px] w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
                placeholder={me ? "Write your comment..." : "Login to comment"}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
                  onClick={addComment}
                >
                  Submit
                </button>
                {!me ? (
                  <button
                    className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
