import crypto from 'crypto';

export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function generateKey(bufferSize = 16, encoding = 'hex'): string {
  return crypto.randomBytes(bufferSize).toString(encoding);
}
