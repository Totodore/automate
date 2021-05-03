import { SnackbarService } from './../services/snackbar.service';
import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }
  
  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.api.logged) {
      this.router.navigateByUrl("");
      return false;
    }
    else if (!this.api.profile) {
      try {
        await this.api.login();
      } catch (e) {
        this.snackbar.snack("Whoops ! It seems like your connection to automate is impossible!");
        this.api.logout();
        this.router.navigateByUrl("");
        return false;
      }
    }
    return true;
  }
  
}
