import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {

  @Output() confirm: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) public text: string,
  ) {}
}