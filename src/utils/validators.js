import { CONFIG } from '../config/passwordConfig.js';
const CATS = ['uppercase', 'lowercase', 'numbers', 'special'];
export const enabledCategories = (o) => CATS.filter((c) => o[c]);

export function validateLength(len) {
  if (typeof len !== 'number' || !Number.isInteger(len)) return 'LENGTH_INTEGER';
  if (len < CONFIG.minLength) return 'LENGTH_MIN';
  if (len > CONFIG.maxLength) return 'LENGTH_MAX';
  return null;
}
export function validateQuantity(q) {
  return Number.isInteger(q) && q >= 1 && q <= CONFIG.maxQuantity ? null : 'QUANTITY_INVALID';
}
export const ERROR_MESSAGES = {
  LENGTH_INTEGER: 'Length must be a whole number.',
  LENGTH_MIN: `Length must be at least ${CONFIG.minLength}.`,
  LENGTH_MAX: `Length must be at most ${CONFIG.maxLength}.`,
  QUANTITY_INVALID: `Quantity must be a whole number from 1 to ${CONFIG.maxQuantity}.`,
  NO_CATEGORY: 'Select at least one character type.',
  TOO_SHORT: 'Length is shorter than the number of required character types.',
  EMPTY_POOL: 'No usable characters remain after exclusions.',
  NO_CATEGORY_CHARS: 'An enabled character type has no characters left after exclusions.',
  NO_CRYPTO: 'Secure random generation is not available in this browser.',
};
