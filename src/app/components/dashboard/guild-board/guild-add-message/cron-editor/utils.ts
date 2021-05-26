// @dynamic
export default class Utils {
  /** This returns a range of numbers. Starts from 0 if 'startFrom' is not set */
  public static getRange(startFrom: number, until: number) {
      return Array.from({ length: (until + 1 - startFrom) }, (_, k) => k + startFrom);
  }
}
export const Days = {
  'SUN': 'Sunday',
  'MON': 'Monday',
  'TUE': 'Tuesday',
  'WED': 'Wednesday',
  'THU': 'Thursday',
  'FRI': 'Friday',
  'SAT': 'Saturday'
};

export const MonthWeeks = {
  '#1': 'First',
  '#2': 'Second',
  '#3': 'Third',
  '#4': 'Fourth',
  '#5': 'Fifth',
  'L': 'Last'
};

export enum Months {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}
