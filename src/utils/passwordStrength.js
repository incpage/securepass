import { CONFIG } from '../config/passwordConfig.js';
export const LABELS = ['Very Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];

/** Theoretical entropy: length * log2(pool). Valid only for uniformly random passwords. */
export const theoreticalEntropy = (length, pool) => (pool > 1 ? length * Math.log2(pool) : 0);

/** Heuristic score: theoretical entropy minus penalties for repeats and sequences. Not a guarantee. */
export function assessStrength(password, pool) {
  const factors = [];
  let bits = theoreticalEntropy(password.length, pool || new Set(password).size);
  if (/(.)\1\1/.test(password)) { bits *= 0.85; factors.push('Contains repeated characters'); }
  if (/(?:abc|bcd|cde|123|234|345|456|789|qwe|asd|zxc)/i.test(password)) { bits *= 0.8; factors.push('Contains a predictable sequence'); }
  if (/password|admin|letmein|welcome/i.test(password)) { bits *= 0.5; factors.push('Contains a common word'); }
  if (password.length >= 16) factors.push('Good length');
  const kinds = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(password)).length;
  factors.push(`${kinds} character type(s) used`);
  const level = CONFIG.strengthThresholds.filter((t) => bits >= t).length;
  return { level, label: LABELS[level], bits: Math.round(bits), factors };
}
