import { MenuComponent } from './menu/menu.component';
import { GuildBoardComponent } from './guild-board/guild-board.component';
import { GuildInfo } from 'passport-discord';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ChildActivationEnd, NavigationEnd, Router, RoutesRecognized } from '@angular/router';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public currentGuildId?: string;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.currentGuildId = this.route.snapshot?.firstChild?.paramMap.get("id") || undefined;
    this.router.events.subscribe(e => {
      if (e instanceof ChildActivationEnd && e.snapshot.component === DashboardComponent) {
        this.currentGuildId = e.snapshot?.firstChild?.paramMap.get("id") || undefined;
      }
    })
  }

}
