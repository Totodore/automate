import { ApiService } from 'src/app/services/api.service';
import { DiscordGuild } from './../../../../models/api.model';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-added-guilds',
  templateUrl: './added-guilds.component.html',
  styleUrls: ['./added-guilds.component.scss']
})
export class AddedGuildsComponent {

  public readonly cdn = environment.discordCdn;
  
  constructor(
    private readonly api: ApiService
  ) { }

  public get guilds(): DiscordGuild[] {
    return this.api.profile?.guilds.filter(guild => guild.added) ?? [];
  }

}
