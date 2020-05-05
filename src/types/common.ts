export interface IRetryOptions {
  delayMs?: number;
  maxAttempts?: number;
  onlyIf?: (error?: Error) => boolean;
}
