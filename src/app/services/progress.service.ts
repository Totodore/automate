import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  private _mode: "determinate" | "indeterminate" = "indeterminate";
  private _showing = false;
  private _value = 0;

  public show(determinate = false) {
    this._mode = determinate ? "determinate" : "indeterminate";
    if (!this._showing)
      this._showing = true;
  }
  public hide() {
    if (this.showing)
      this._showing = false;
  }
  public updateValue(val: number) {
    this._value = val;
  }

  get mode(): "determinate" | "indeterminate" {
    return this._mode;
  }
  get showing(): boolean {
    return this._showing;
  }
  get value(): number {
    return this._value;
  }
}