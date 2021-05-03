import { SnackbarService } from './../services/snackbar.service';
import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard implements CanActivate {
  
  constructor(
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }
  
  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.router.navigateByUrl("board");
    if (this.api.logged) {
      this.router.navigateByUrl("board");
      return false;
    }
    const token = route.queryParamMap.get("token");
    if (token) {
      try {
        await this.api.login(token);
        this.router.navigateByUrl("board");
        return false;
      } catch (e) {
        this.snackbar.snack("Whoops ! It seems like your connection to automate is impossible!")
        return true;
      }
    }
    return true;
  }
  
}
