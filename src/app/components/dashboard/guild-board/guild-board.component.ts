import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-guild-board',
  templateUrl: './guild-board.component.html',
  styleUrls: ['./guild-board.component.scss']
})
export class GuildBoardComponent implements OnInit {

  public guildId: string | null = null;
  
  constructor(
    private readonly route: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(e => this.guildId = e.get("id"));
  }

}
