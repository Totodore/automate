import { ApiService } from './../services/api.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoGuildGuard implements CanActivate {

  constructor(
    private readonly api: ApiService,
    private readonly router: Router
  ) {}
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const guildId = route.paramMap.get("id");
    const guild = this.api.profile?.guilds.find(el => el.id === guildId);
    return guild?.added ? true : this.router.parseUrl(`/board/${guildId}/add`);
  }

}
