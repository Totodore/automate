import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(
		private readonly _snackBar: MatSnackBar,
  ) { }

  public async snack(content: string, duration: number = 4500) {
    await this._snackBar.open(content, undefined, { duration: duration == 0 ? undefined : duration }).afterDismissed().toPromise();
  }
}