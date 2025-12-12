"use client";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-700 dark:text-red-200">
        {error.message}
      </div>
    </div>
  );
}
