import { IRetryOptions } from '../types/common';

export function isNumber(value: any) {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

export function toString(value: any) {
  if (value === null || value === undefined) {
    return '';
  }
  return value?.toString() || String(value);
}

export function toNumber (value: any): number {
  const maybeNumber = Number( value );
  return Number.isNaN(maybeNumber) ? 0 : maybeNumber;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry<T = any>(
  cb: () => Promise<T>,
  options?: IRetryOptions
): Promise<T> {
  const {
    delayMs = 0,
    maxAttempts = 1,
    onlyIf = () => true
  } = options;

  let attempts = 0;

  const tryFn = () => {
    attempts++;

    return Promise.resolve(cb()).catch(error => {
      if (!onlyIf(error) || attempts >= maxAttempts) {
        throw error;
      }

      return delay(delayMs).then(tryFn);
    });
  };

  return tryFn();
}
