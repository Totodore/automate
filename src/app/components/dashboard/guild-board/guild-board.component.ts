import { GuildReqModel } from './../../../models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DiscordGuild } from 'src/app/models/api.model';

@Component({
  selector: 'app-guild-board',
  templateUrl: './guild-board.component.html',
  styleUrls: ['./guild-board.component.scss']
})
export class GuildBoardComponent implements OnInit {

  public guildId: string | null = null;
  public discordGuild?: DiscordGuild;
  public guild?: GuildReqModel;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(async e => {
      this.guildId = e.get("id")
      if (this.guildId) {
        this.discordGuild = this.api.profile?.guilds.find(el => el.id === this.guildId);
        this.guild = await this.api.getGuild(this.guildId);
      }
    });
  }
}
