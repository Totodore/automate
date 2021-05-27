import { Days, MonthWeeks } from "./utils";

export interface SelectOptionsModel {
  months: number[]
  monthWeeks: (keyof typeof MonthWeeks)[],
  days: (keyof typeof Days)[],
  minutes: number[],
  fullMinutes: number[],
  hours: number[],
  monthDays: number[],
  monthDaysWithLasts: string[],
}

export interface StateDataModel {
  minutes: {
    minutes: number,
  },
  hourly: {
    hours: number,
    minutes: number,
  },
  daily: {
    subTab: string,
    everyDays: {
      days: number,
      hours: number,
      minutes: number,
    },
    everyWeekDay: {
      hours: number,
      minutes: number,
    }
  },
  weekly: {
    dow: { [k in DoW]: boolean },
    hours: number,
    minutes: number,
  },
  monthly: {
    subTab: "specificDay" | "specificWeekDay",
    runOnWeekday: boolean,
    specificDay: {
      day: string,
      months: number,
      hours: number,
      minutes: number,
    },
    specificWeekDay: {
      monthWeek: string,
      day: string,
      startMonth: number,
      months: number,
      hours: number,
      minutes: number,
    }
  },
  advanced: {
    expression: string
  },
  date: {
    date: Date,
    hours: number,
    minutes: number
  }
  validation: {
    isValid: boolean,
    errorMessage: string
  }
}

export enum DoW {
  MON = "MON",
  TUE = "TUE",
  WED = "WED",
  THU = "THU",
  FRI = "FRI",
  SAT = "SAT",
  SUN = "SUN",
}

export type Tab = "minutes" | "hourly" | "daily" | "weekly" | "monthly" | "advanced" | "date";