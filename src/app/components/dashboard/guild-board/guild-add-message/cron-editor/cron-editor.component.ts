import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { SelectOptionsModel, StateDataModel, DoW } from './cron-options';
import Utils, { Days, Months, MonthWeeks } from './utils';

@Component({
  selector: 'app-cron-editor',
  templateUrl: './cron-editor.component.html',
  styleUrls: ['./cron-editor.component.scss']
})
export class CronEditorComponent implements OnInit {
  @Input() get cron(): string { return this.localCron; }
  
  set cron(value: string) {
    this.localCron = value;
    this.cronChange.emit(this.localCron);
  }

  // the name is an Angular convention, @Input variable name + "Change" suffix
  @Output() cronChange = new EventEmitter();

  public activeTab!: string;
  public selectOptions = this.getSelectOptions();
  public state!: StateDataModel;
  public showSpinner = false;

  private localCron!: string;
  private isDirty!: boolean;

  public ngOnInit() {
    this.state = this.getDefaultState();

    this.handleModelChange(this.cron);
  }

  public ngOnChanges(changes: SimpleChanges) {
    const newCron = changes['cron'];
    if (newCron && !newCron.firstChange) {
      this.handleModelChange(this.cron);
    }
  }

  public setActiveTab(tab: string) {
      this.activeTab = tab;
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

  public regenerateCron() {
    console.log(this.state.daily.subTab);
    this.isDirty = true;

    switch (this.activeTab) {
      case 'minutes':
        this.cron = `0/${this.state.minutes.minutes} * 1/1 * ?`;
        break;
      case 'hourly':
        this.cron = `${this.state.hourly.minutes} 0/${this.state.hourly.hours} 1/1 * ?`;
        break;
      case 'daily':
        switch (this.state.daily.subTab) {
          case 'everyDays':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.daily.everyDays.minutes} ${this.state.daily.everyDays.hours} 1/${this.state.daily.everyDays.days} * ?`;
            break;
          case 'everyWeekDay':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.daily.everyWeekDay.minutes} ${this.state.daily.everyWeekDay.hours} ? * MON-FRI`;
            break;
          default:
            throw new Error('Invalid cron daily subtab selection');
        }
        break;
      case 'weekly':
        const days = this.selectOptions.days
        //@ts-ignore
          .reduce((acc, day) => this.state.weekly[day] ? acc.concat([day]) : acc, [])
          .join(',');
        this.cron = `${this.state.weekly.minutes} ${this.state.weekly.hours} ? * ${days}`;
        break;
      case 'monthly':
        switch (this.state.monthly.subTab) {
          case 'specificDay':
            const day = this.state.monthly.runOnWeekday ? `${this.state.monthly.specificDay.day}W` : this.state.monthly.specificDay.day;
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.monthly.specificDay.minutes} ${this.state.monthly.specificDay.hours} ${day} 1/${this.state.monthly.specificDay.months} ?`;
            break;
          case 'specificWeekDay':
            // tslint:disable-next-line:max-line-length
            this.cron = `${this.state.monthly.specificWeekDay.minutes} ${this.state.monthly.specificWeekDay.hours} ? ${this.state.monthly.specificWeekDay.startMonth}/${this.state.monthly.specificWeekDay.months} ${this.state.monthly.specificWeekDay.day}${this.state.monthly.specificWeekDay.monthWeek}`;
            break;
          default:
            throw new Error('Invalid cron monthly subtab selection');
        }
        break;
      case 'advanced':
        this.cron = this.state.advanced.expression;
        break;
      default:
        throw new Error('Invalid cron active tab selection');
    }
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

  private getAmPmHour(hour: number) {
    return hour;
  }

  private handleModelChange(cron: string) {
    if (this.isDirty) {
      this.isDirty = false;
      return;
    } else {
      this.isDirty = false;
    }

    this.validate(cron);

    let cronSeven = cron;

    cronSeven = `0 ${cron}`;

    cronSeven = `${cronSeven} *`;

    const [minutes, hours, dayOfMonth, month, dayOfWeek] = cronSeven.split(' ');

    if (cronSeven.match(/\d+ 0\/\d+ \* 1\/1 \* \? \*/)) {
      this.activeTab = 'minutes';

      this.state.minutes.minutes = Number(minutes.substring(2));
    } else if (cronSeven.match(/\d+ \d+ 0\/\d+ 1\/1 \* \? \*/)) {
      this.activeTab = 'hourly';

      this.state.hourly.hours = Number(hours.substring(2));
      this.state.hourly.minutes = Number(minutes);
    } else if (cronSeven.match(/\d+ \d+ \d+ 1\/\d+ \* \? \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyDays';
      this.state.daily.everyDays.days = Number(dayOfMonth.substring(2));
      const parsedHours = Number(hours);
      this.state.daily.everyDays.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyDays.minutes = Number(minutes);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \* MON-FRI \*/)) {
      this.activeTab = 'daily';

      this.state.daily.subTab = 'everyWeekDay';
      const parsedHours = Number(hours);
      this.state.daily.everyWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.daily.everyWeekDay.minutes = Number(minutes);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \* (MON|TUE|WED|THU|FRI|SAT|SUN)(,(MON|TUE|WED|THU|FRI|SAT|SUN))* \*/)) {
      this.activeTab = 'weekly';
      //@ts-ignore
      this.selectOptions.days.forEach(weekDay => this.state.weekly[weekDay] = false);
      //@ts-ignore
      dayOfWeek.split(',').forEach(weekDay => this.state.weekly[weekDay] = true);
      const parsedHours = Number(hours);
      this.state.weekly.hours = this.getAmPmHour(parsedHours);
      this.state.weekly.minutes = Number(minutes);
    } else if (cronSeven.match(/\d+ \d+ \d+ (\d+|L|LW|1W) 1\/\d+ \? \*/)) {
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificDay';

      if (dayOfMonth.indexOf('W') !== -1) {
        this.state.monthly.specificDay.day = dayOfMonth.charAt(0);
        this.state.monthly.runOnWeekday = true;
      } else {
        this.state.monthly.specificDay.day = dayOfMonth;
      }

      this.state.monthly.specificDay.months = Number(month.substring(2));
      const parsedHours = Number(hours);
      this.state.monthly.specificDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificDay.minutes = Number(minutes);
    } else if (cronSeven.match(/\d+ \d+ \d+ \? \d+\/\d+ (MON|TUE|WED|THU|FRI|SAT|SUN)((#[1-5])|L) \*/)) {
      const day = dayOfWeek.substr(0, 3);
      const monthWeek = dayOfWeek.substr(3);
      this.activeTab = 'monthly';
      this.state.monthly.subTab = 'specificWeekDay';
      this.state.monthly.specificWeekDay.monthWeek = monthWeek;
      this.state.monthly.specificWeekDay.day = day;

      if (month.indexOf('/') !== -1) {
        const [startMonth, months] = month.split('/').map(Number);
        this.state.monthly.specificWeekDay.months = months;
        this.state.monthly.specificWeekDay.startMonth = startMonth;
      }

      const parsedHours = Number(hours);
      this.state.monthly.specificWeekDay.hours = this.getAmPmHour(parsedHours);
      this.state.monthly.specificWeekDay.minutes = Number(minutes);
    } else {
      this.activeTab = 'advanced';
      this.state.advanced.expression = cron;
    }
  }

  private validate(cron: string): void {
    this.state.validation.isValid = false;
    this.state.validation.errorMessage = '';

    if (!cron) {
      this.state.validation.errorMessage = 'Cron expression cannot be null';
      return;
    }

    const cronParts = cron.split(' ');

    let expected = 5;

    if (cronParts.length !== expected) {
      this.state.validation.errorMessage = `Invalid cron expression, there must be ${expected} segments`;
      return;
    }

    this.state.validation.isValid = true;
    return;
  }

  private getDefaultAdvancedCronExpression(): string {
    return '15 10 L-2 * ?';
  }


  private getDefaultState(): StateDataModel {
    const [defaultHours, defaultMinutes] = [0, 0];

    return {
      minutes: {
        minutes: 1,
      },
      hourly: {
        hours: 1,
        minutes: 0,
      },
      daily: {
        subTab: 'everyDays',
        everyDays: {
          days: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
        },
        everyWeekDay: {
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
        }
      },
      weekly: {
        dow: {
          MON: true,
          TUE: false,
          WED: false,
          THU: false,
          FRI: false,
          SAT: false,
          SUN: false,
        },
        hours: this.getAmPmHour(defaultHours),
        minutes: defaultMinutes,
      },
      monthly: {
        subTab: 'specificDay',
        runOnWeekday: false,
        specificDay: {
          day: '1',
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
        },
        specificWeekDay: {
          monthWeek: '#1',
          day: 'MON',
          startMonth: 1,
          months: 1,
          hours: this.getAmPmHour(defaultHours),
          minutes: defaultMinutes,
        }
      },
      advanced: {
        expression: this.getDefaultAdvancedCronExpression()
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
