export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
      <main className="w-full rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-black">
        <h1 className="text-2xl font-semibold">News Portal</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Simulated login + CRUD news + comments (JSON-Server backend).
        </p>
        <div className="mt-6 flex gap-3">
          <a
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
            href="/login"
          >
            Login
          </a>
          <a
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium dark:border-white/10"
            href="/news"
          >
            View News
          </a>
        </div>
      </main>
    </div>
  );
}
