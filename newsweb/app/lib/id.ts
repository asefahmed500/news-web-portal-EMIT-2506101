export function nextId(existing: { id: number | string }[]): number {
  const nums = existing.map((x) => Number(x.id)).filter((n) => Number.isFinite(n));
  return nums.length ? Math.max(...nums) + 1 : 1;
}
