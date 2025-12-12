import type { NewsItem, User } from "./types";
import { API_BASE_URL } from "./config";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }

  const data = await res.json();
  return normalizeIds(data) as T;
}

// json-server 1.x returns top-level IDs as strings; normalize to numbers
function normalizeIds(data: unknown): unknown {
  if (Array.isArray(data)) {
    return data.map(normalizeIds);
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === "id" && typeof value === "string" && /^\d+$/.test(value)) {
        result[key] = Number(value);
      } else {
        result[key] = normalizeIds(value);
      }
    }
    return result;
  }
  return data;
}

export const api = {
  listUsers: () => apiFetch<User[]>("/users"),
  listNews: () => apiFetch<NewsItem[]>("/news"),
  getNews: (id: number) => apiFetch<NewsItem>(`/news/${id}`),
  createNews: (payload: Omit<NewsItem, "id">) =>
    apiFetch<NewsItem>("/news", { method: "POST", body: JSON.stringify(payload) }),
  patchNews: (id: number, patch: Partial<NewsItem>) =>
    apiFetch<NewsItem>(`/news/${id}`, {
      method: "PATCH",
      body: JSON.stringify(patch),
    }),
  deleteNews: (id: number) => apiFetch<void>(`/news/${id}`, { method: "DELETE" }),
};
