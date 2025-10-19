// src/lib/validation.ts
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

export function validatePassword(password: string): boolean {
  // mínimo 8 chars, pelo menos 1 letra, 1 número
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

export function sanitizeString(input: string): string {
  // remove tags HTML básicas
  return input.replace(/<[^>]*>?/gm, '').trim();
}
