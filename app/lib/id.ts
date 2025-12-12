export function nextId(existing: { id: number }[]): number {
  return existing.length ? Math.max(...existing.map((x) => x.id)) + 1 : 1;
}
