import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {

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
  public readonly change = new EventEmitter();


  constructor() { }

  ngOnInit(): void {
  }

}
