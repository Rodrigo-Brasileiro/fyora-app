// fyora-app/tests/unit/validation.test.ts
import { validateEmail, validatePassword, sanitizeString } from '../../lib/validation';

describe('validation lib', () => {
  test('validateEmail accepts valid and rejects invalid', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid@com')).toBe(false);
  });

  test('validatePassword rules', () => {
    expect(validatePassword('abc')).toBe(false);
    expect(validatePassword('Password1')).toBe(true);
  });

  test('sanitizeString removes tags and trims', () => {
    expect(sanitizeString(' <b>hello</b> ')).toBe('hello');
  });
});
