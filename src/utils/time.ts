export enum ETimePeriod {
  SECOND = 1000,
  MINUTE = 60 * ETimePeriod.SECOND,
  HOUR = 60 * ETimePeriod.MINUTE,
  DAY = 24 * ETimePeriod.HOUR,
  MONTH = 30 * ETimePeriod.DAY,
  YEAR = 365 * ETimePeriod.MONTH
}

export function timeAfter (period: ETimePeriod): Date {
  return new Date(Date.now() + period);
}

export function timeBefore (period: ETimePeriod): Date {
  return new Date(Date.now() - period);
}
