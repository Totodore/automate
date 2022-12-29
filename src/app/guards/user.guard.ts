import { SnackbarService } from './../services/snackbar.service';
import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }
  
  public async canActivate() {
    if (!this.api.logged)
      return this.router.parseUrl("/");
    else if (!this.api.profile) {
      try {
        await this.api.login();
      } catch (e) {
        this.snackbar.snack("Whoops ! It seems like your connection to automate is impossible!");
        this.api.logout();
        return this.router.parseUrl("/");
      }
    }
    return true;
  }
  
}
