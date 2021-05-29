import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { SelectOptionsModel, StateDataModel, DoW, Tab } from './cron-options';
import Utils, { Days, Months, MonthWeeks } from './utils';
import { toString as cronDescriptor } from "cronstrue";

@Component({
  selector: 'app-cron-editor',
  templateUrl: './cron-editor.component.html',
  styleUrls: ['./cron-editor.component.scss']
})
export class CronEditorComponent implements OnInit {
  @Input() get cron(): string { return this.localCron; }
  @Input() date!: Date;

  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
  }

  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<Date>();
  @Output() onError = new EventEmitter<string>();

  public activeTab: Tab = "minutes";
  public selectOptions = this.getSelectOptions();
  public state!: StateDataModel;
  public showSpinner = false;

  private localCron!: string;

  public ngOnInit() {
    this.state = this.getDefaultState();
    this.regenerateCron();
  }

  public setActiveTab(event: MatTabChangeEvent) {
      this.activeTab = event.tab.ariaLabel as Tab;
      this.regenerateCron();
  }

  public dayDisplay(day: keyof typeof Days): typeof Days[keyof typeof Days] {
    return Days[day];
  }

  public monthWeekDisplay(monthWeekNumber: keyof typeof MonthWeeks): typeof MonthWeeks[keyof typeof MonthWeeks] {
    return MonthWeeks[monthWeekNumber];
  }

  public monthDisplay(month: number): string {
    return Months[month];
  }

  public monthDayDisplay(month: string): string {
    if (month === 'L') {
      return 'Last Day';
    } else if (month === 'LW') {
      return 'Last Weekday';
    } else if (month === '1W') {
      return 'First Weekday';
    } else {
      return `${month}${this.getOrdinalSuffix(month)} day`;
    }
  }

  public async regenerateCron() {
    await new Promise(resolve => setTimeout(resolve));
    switch (this.activeTab) {
      case 'minutes':
        if (this.state.minutes.minutes > 0)
          this.cron = `0/${this.state.minutes.minutes} * 1/1 * ?`;
        break;
      case 'hourly':
        if (this.state.hourly.hours > 0)
          this.cron = `${this.state.hourly.minutes} 0/${this.state.hourly.hours} 1/1 * ?`;
        break;
      case 'daily':
        switch (this.state.daily.subTab) {
          case 'everyDays':
            if (this.state.daily.everyDays.days > 0)
              this.cron = `${this.state.daily.everyDays.minutes} ${this.state.daily.everyDays.hours} 1/${this.state.daily.everyDays.days} * ?`;
            break;
          case 'everyWeekDay':
            this.cron = `${this.state.daily.everyWeekDay.minutes} ${this.state.daily.everyWeekDay.hours} ? * MON-FRI`;
            break;
          default:
            throw new Error('Invalid cron daily subtab selection');
        }
        break;
      case 'weekly':
        const days = this.selectOptions.days
        //@ts-ignore
          .reduce((acc, day) => this.state.weekly.dow[day] ? acc.concat([day]) : acc, [])
          .join(',');
        if (days.length > 0)
          this.cron = `${this.state.weekly.minutes} ${this.state.weekly.hours} ? * ${days}`;
        break;
      case 'monthly':
        switch (this.state.monthly.subTab) {
          case 'specificDay':
            const days = this.state.monthly.specificDay.day.reduce((prev, curr) => prev + "," + curr, "").substr(1);
            if (days.length > 0 && this.state.monthly.specificDay.months > 0)
              this.cron = `${this.state.monthly.specificDay.minutes} ${this.state.monthly.specificDay.hours} ${days} 1/${this.state.monthly.specificDay.months} ?`;
            break;
          case 'specificWeekDay':
            if (this.state.monthly.specificWeekDay.startMonth && this.state.monthly.specificWeekDay.months && this.state.monthly.specificWeekDay.monthWeek && this.state.monthly.specificWeekDay.day)
              this.cron = `${this.state.monthly.specificWeekDay.minutes} ${this.state.monthly.specificWeekDay.hours} ? ${this.state.monthly.specificWeekDay.startMonth}/${this.state.monthly.specificWeekDay.months} ${this.state.monthly.specificWeekDay.day}${this.state.monthly.specificWeekDay.monthWeek}`;
            break;
          default:
            throw new Error('Invalid cron monthly subtab selection');
        }
        break;
      case 'advanced':
        if (this.state.advanced.expression.split(" ").length == 7)
          this.state.advanced.expression = 0 + this.state.advanced.expression.substr(this.state.advanced.expression.indexOf(" "));
        if (this.validate(this.state.advanced.expression))
          this.cron = this.state.advanced.expression;
        else {
          this.onError.emit("Bad cron expression!");
          return;
        }
        break;
      case 'date':
        this.dateChange.emit(new Date(this.state.date.date.getTime() + this.state.date.hours * 3.6e6 + this.state.date.minutes * 60_000))
        break;
    }
    this.onError.emit(undefined);
  }

  public getDowObject(): { [k in DoW]: string } {
    return {
      MON: "Monday",
      TUE: "Tuesday",
      WED: "Wednesday",
      THU: "Thursday",
      FRI: "Friday",
      SAT: "Saturday",
      SUN: "Sunday"
    };
  }
  public getMonths(): string[] {
    return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }
  private validate(cron: string): boolean {
    return (/^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?(?:,(?:[0-6])(?:(?:-|\/|\,|#)(?:[0-6]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/
      .test(cron) ||
      /^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$/
      .test(cron)) && !cronDescriptor(cron, { verbose: true, throwExceptionOnParseError: false })?.includes("second");
  }


  private getDefaultState(): StateDataModel {
    const [defaultHours, defaultMinutes] = [0, 0];

    return {
      minutes: {
        minutes: 20,
      },
      hourly: {
        hours: 1,
        minutes: 0,
      },
      daily: {
        subTab: 'everyDays',
        everyDays: {
          days: 1,
          hours: defaultHours,
          minutes: defaultMinutes,
        },
        everyWeekDay: {
          hours: defaultHours,
          minutes: defaultMinutes,
        }
      },
      weekly: {
        dow: {
          MON: false,
          TUE: false,
          WED: false,
          THU: false,
          FRI: false,
          SAT: false,
          SUN: false,
        },
        hours: defaultHours,
        minutes: defaultMinutes,
      },
      monthly: {
        subTab: 'specificDay',
        specificDay: {
          day: [],
          months: 1,
          hours: defaultHours,
          minutes: defaultMinutes,
        },
        specificWeekDay: {
          monthWeek: '#1',
          day: 'MON',
          startMonth: 1,
          months: 1,
          hours: defaultHours,
          minutes: defaultMinutes,
        }
      },
      advanced: {
        expression: '0 0/30 0 ? * * *'
      },
      date: {
        date: new Date(),
        hours: new Date().getHours(),
        minutes: new Date().getMinutes() + 5
      },
      validation: {
        isValid: true,
        errorMessage: ''
      }
    };
  }

  private getOrdinalSuffix(value: string) {
    if (value.length > 1) {
      const secondToLastDigit = value.charAt(value.length - 2);
      if (secondToLastDigit === '1') {
        return 'th';
      }
    }

    const lastDigit = value.charAt(value.length - 1);
    switch (lastDigit) {
      case '1':
        return 'st';
      case '2':
        return 'nd';
      case '3':
        return 'rd';
      default:
        return 'th';
    }
  }

  private getSelectOptions(): SelectOptionsModel {
    return {
      months: Utils.getRange(1, 12),
      monthWeeks: Object.keys(MonthWeeks) as (keyof typeof MonthWeeks)[],
      days: Object.keys(Days) as (keyof typeof Days)[],
      minutes: Utils.getRange(0, 59),
      fullMinutes: Utils.getRange(0, 59),
      hours: Utils.getRange(1, 23),
      monthDays: Utils.getRange(1, 31),
      monthDaysWithLasts: [...Utils.getRange(1, 31).map(String), 'L'],
    };
  }

}
