import { SnackbarService } from './../services/snackbar.service';
import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard implements CanActivate {
  
  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }
  
  public async canActivate(route: ActivatedRouteSnapshot) {
    if (this.api.logged) {
      return this.router.parseUrl("/board");
    }
    const token = route.queryParamMap.get("token");
    if (token) {
      try {
        await this.api.login(token);
        return this.router.parseUrl("/board");
      } catch (e) {
        this.snackbar.snack("Whoops ! It seems like your connection to automate is impossible!")
        return true;
      }
    }
    return true;
  }
  
}
