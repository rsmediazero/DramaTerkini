const store = new Map<string, { count: number; resetAt: number }>();

export function hit(ip: string, limit = 60, windowMs = 60_000) {
  const now = Date.now();
  const slot = store.get(ip);

  if (!slot || slot.resetAt < now) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (slot.count >= limit) return { ok: false, remaining: 0 };
  slot.count++;

  return { ok: true, remaining: limit - slot.count };
}
