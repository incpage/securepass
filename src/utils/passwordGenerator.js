import { CONFIG, POOLS } from '../config/passwordConfig.js';
import { randomInt, shuffle, assertSecureRandom } from './secureRandom.js';
import { validateLength, enabledCategories } from './validators.js';

/** Build the per-category pools after applying exclusions. */
export function buildPools(o) {
  const excluded = new Set([...(o.excludeAmbiguous ? CONFIG.ambiguousChars : ''), ...(o.excludeCustom || '')]);
  const raw = { ...POOLS, special: CONFIG.specialChars };
  const pools = {};
  for (const c of enabledCategories(o)) {
    pools[c] = [...new Set(raw[c])].filter((ch) => !excluded.has(ch));
  }
  return pools;
}
/** Returns an error code or null. Never includes password content. */
export function validateOptions(o) {
  const lenErr = validateLength(o.length);
  if (lenErr) return lenErr;
  const cats = enabledCategories(o);
  if (!cats.length) return 'NO_CATEGORY';
  const pools = buildPools(o);
  if (o.requireEach !== false && o.length < cats.length) return 'TOO_SHORT';
  if (cats.some((c) => pools[c].length === 0)) {
    return Object.values(pools).every((p) => !p.length) ? 'EMPTY_POOL' : 'NO_CATEGORY_CHARS';
  }
  return null;
}
export function generatePassword(o) {
  try { assertSecureRandom(); } catch { throw Object.assign(new Error('NO_CRYPTO'), { code: 'NO_CRYPTO' }); }
  const err = validateOptions(o);
  if (err) throw Object.assign(new Error(err), { code: err });
  const pools = buildPools(o);
  const all = Object.values(pools).flat();
  const chars = [];
  if (o.requireEach !== false) for (const p of Object.values(pools)) chars.push(p[randomInt(p.length)]);
  while (chars.length < o.length) chars.push(all[randomInt(all.length)]);
  return shuffle(chars).join('');
}
/** Generate n passwords; retries duplicates a bounded number of times. */
export function generateMany(o, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    let pw = generatePassword(o);
    for (let t = 0; t < CONFIG.maxDuplicateRetries && out.includes(pw); t++) pw = generatePassword(o);
    out.push(pw);
  }
  return out;
}
export const poolSize = (o) => new Set(Object.values(buildPools(o)).flat()).size;
