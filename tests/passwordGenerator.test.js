import { describe, it, expect } from 'vitest';
import { generatePassword, validateOptions } from '../src/utils/passwordGenerator.js';
import { randomInt } from '../src/utils/secureRandom.js';
import { CONFIG } from '../src/config/passwordConfig.js';
const base = { length: 16, ...CONFIG.defaultOptions };
describe('generator', () => {
  it('default settings', () => expect(generatePassword(base)).toHaveLength(16));
  it.each([8, 16, 128])('length %i', (n) => expect(generatePassword({ ...base, length: n })).toHaveLength(n));
  it('rejects too short/long/decimal/negative', () => {
    expect(validateOptions({ ...base, length: 7 })).toBe('LENGTH_MIN');
    expect(validateOptions({ ...base, length: 129 })).toBe('LENGTH_MAX');
    expect(validateOptions({ ...base, length: 10.5 })).toBe('LENGTH_INTEGER');
    expect(validateOptions({ ...base, length: -5 })).toBe('LENGTH_MIN');
  });
  it('rejects no categories', () => {
    const o = { ...base, uppercase: false, lowercase: false, numbers: false, special: false };
    expect(() => generatePassword(o)).toThrow();
  });
  it('includes every enabled category', () => {
    for (let i = 0; i < 200; i++) {
      const p = generatePassword({ ...base, length: 8 });
      expect(p).toMatch(/[A-Z]/); expect(p).toMatch(/[a-z]/); expect(p).toMatch(/\d/); expect(p).toMatch(/[^A-Za-z0-9]/);
    }
  });
  it('respects exclusions', () => {
    const p = generatePassword({ ...base, length: 128, excludeAmbiguous: true });
    expect(p).not.toMatch(/[Il1O0o]/);
  });
  it('randomInt stays in range', () => {
    for (let i = 0; i < 1000; i++) { const n = randomInt(7); expect(n).toBeGreaterThanOrEqual(0); expect(n).toBeLessThan(7); }
  });
});
