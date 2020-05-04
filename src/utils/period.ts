export enum EPeriod {
  SECOND = 1000,
  MINUTE = 60 * EPeriod.SECOND,
  HOUR = 60 * EPeriod.MINUTE,
  DAY = 24 * EPeriod.HOUR,
  MONTH = 30 * EPeriod.DAY,
  YEAR = 365 * EPeriod.MONTH
}
