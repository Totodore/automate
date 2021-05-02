import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoUserGuard implements CanActivate {
  
  constructor(
    private readonly router: Router
  ) { }
  
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.router.navigateByUrl("board");
    return true;
  }
  
}
