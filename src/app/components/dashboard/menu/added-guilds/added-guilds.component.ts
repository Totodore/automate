import { ApiService } from 'src/app/services/api.service';
import { DiscordGuild } from './../../../../models/api.model';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-added-guilds',
  templateUrl: './added-guilds.component.html',
  styleUrls: ['./added-guilds.component.scss']
})
export class AddedGuildsComponent implements OnInit {

  public readonly cdn = environment.discordCdn;
  
  constructor(
    private readonly api: ApiService
  ) { }

  ngOnInit(): void {
  }

  public get guilds(): DiscordGuild[] {
    return this.api.profile?.guilds.filter(guild => guild.added)!;
  }

}
