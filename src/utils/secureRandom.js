// Unbiased CSPRNG helpers built on crypto.getRandomValues (never Math.random).
export function assertSecureRandom() {
  const c = globalThis.crypto;
  if (!c || typeof c.getRandomValues !== 'function') {
    const e = new Error('Secure random generation is unavailable.');
    e.code = 'NO_CRYPTO';
    throw e;
  }
}
/** Uniform integer in [0, max) using rejection sampling to avoid modulo bias. */
export function randomInt(max) {
  assertSecureRandom();
  if (!Number.isInteger(max) || max <= 0 || max > 2 ** 32) throw new RangeError('Invalid range');
  const limit = Math.floor(2 ** 32 / max) * max; // largest multiple of max <= 2^32
  const buf = new Uint32Array(1);
  do { globalThis.crypto.getRandomValues(buf); } while (buf[0] >= limit);
  return buf[0] % max;
}
/** Fisher–Yates shuffle driven by randomInt. */
export function shuffle(items) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
