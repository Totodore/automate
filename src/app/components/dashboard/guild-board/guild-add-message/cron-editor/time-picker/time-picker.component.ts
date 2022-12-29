import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html'
})
export class TimePickerComponent {

  @Input()
  public hours!: number;

  @Input()
  public minutes!: number;

  @Input()
  public disabled!: boolean;

  @Output()
  public minutesChange = new EventEmitter<number>();

  @Output()
  public hoursChange = new EventEmitter<number>();
  
  @Output()
  public readonly timeChange = new EventEmitter();

  public onChange(type: 'hours' | 'min', e: EventTarget | null) {
    const value = parseInt((e as HTMLInputElement).value);
    if (type === "hours")
      this.hoursChange.emit(value);
    else
      this.minutesChange.emit(value);
    setTimeout(() => this.timeChange.emit());
  }

}
