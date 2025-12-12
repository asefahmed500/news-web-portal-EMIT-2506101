"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { NewsItem, User } from "../../../../lib/types";
import { api } from "../../../../lib/api";
import { getStoredUser } from "../../../../lib/auth";
import { validateNews } from "../../../../lib/validation";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [me, setMe] = useState<User | null>(null);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setMe(user);
    if (!user) router.replace("/login");
  }, [router]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const n = await api.getNews(id);
        if (cancelled) return;
        setItem(n);
        setTitle(n.title);
        setBody(n.body);
      } catch (e) {
        if (!cancelled) setErrors([e instanceof Error ? e.message : "Failed to load"]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSave() {
    setErrors([]);
    const e = validateNews(title, body);
    if (e.length) {
      setErrors(e);
      return;
    }
    if (!item || !me) return;
    if (me.id !== item.author_id) {
      setErrors(["You cannot edit news written by another user."]);
      return;
    }

    try {
      setSaving(true);
      await api.patchNews(item.id, { title: title.trim(), body: body.trim() });
      router.push(`/news/${item.id}`);
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Save failed"]);
    } finally {
      setSaving(false);
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
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
        <h1 className="text-xl font-semibold">Edit News</h1>

        {errors.length ? (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            <ul className="list-disc pl-5">
              {errors.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {loading ? (
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Loading...</p>
        ) : !item ? (
          <p className="mt-4 text-sm">Not found.</p>
        ) : me && me.id !== item.author_id ? (
          <p className="mt-4 text-sm text-red-700 dark:text-red-200">
            You cannot edit news written by another user.
          </p>
        ) : (
          <div className="mt-6 grid gap-3">
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm font-medium">Body</label>
            <textarea
              className="min-h-40 w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="mt-2 flex gap-2">
              <button
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <a
                className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
                href={`/news/${id}`}
              >
                Cancel
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
