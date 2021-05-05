import { DiscordGuild, GuildModel } from './../../../../models/api.model';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guild-header',
  templateUrl: './guild-header.component.html',
  styleUrls: ['./guild-header.component.scss']
})
export class GuildHeaderComponent {

  @Input()
  public discordGuild!: DiscordGuild;

  @Input()
  public guild!: GuildModel;

  public readonly cdn = environment.discordCdn;
  
  constructor() { }
}
