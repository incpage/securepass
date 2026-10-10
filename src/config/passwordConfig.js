// Central configuration. Edit values here only.
export const CONFIG = {
  defaultLength: 16,
  minLength: 8,
  maxLength: 128,
  defaultQuantity: 1,
  maxQuantity: 10,
  maxDuplicateRetries: 5,
  specialChars: '!@#$%^&*()-_=+[]{};:,.?/',
  ambiguousChars: 'Il1O0o',
  defaultOptions: {
    uppercase: true, lowercase: true, numbers: true, special: true,
    excludeAmbiguous: false, excludeCustom: '', requireEach: true,
  },
  // Entropy-based thresholds (bits) for the strength labels.
  strengthThresholds: [28, 45, 60, 80],
};
export const POOLS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
};
