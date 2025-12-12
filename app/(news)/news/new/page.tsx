"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NewsItem, User } from "../../../lib/types";
import { api } from "../../../lib/api";
import { getStoredUser } from "../../../lib/auth";
import { validateNews } from "../../../lib/validation";

export default function CreateNewsPage() {
  const router = useRouter();
  const [me, setMe] = useState<User | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    setMe(user);
    if (!user) router.replace("/login");
  }, [router]);

  async function onSubmit() {
    const e = validateNews(title, body);
    setErrors(e);
    if (e.length) return;
    if (!me) return;

    const payload: Omit<NewsItem, "id"> = {
      title: title.trim(),
      body: body.trim(),
      author_id: me.id,
      comments: [],
    };

    try {
      setSubmitting(true);
      await api.createNews(payload);
      router.push("/news");
    } catch (err) {
      setErrors([err instanceof Error ? err.message : "Create failed"]);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black">
        <h1 className="text-xl font-semibold">Create News</h1>

        {errors.length ? (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-200">
            <ul className="list-disc pl-5">
              {errors.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 grid gap-3">
          <label className="text-sm font-medium">Title</label>
          <input
            className="w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="text-sm font-medium">Body</label>
          <textarea
            className="min-h-[160px] w-full rounded-lg border border-black/10 bg-transparent p-2 text-sm dark:border-white/10"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className="mt-2 flex gap-2">
            <button
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
            <a
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
              href="/news"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
