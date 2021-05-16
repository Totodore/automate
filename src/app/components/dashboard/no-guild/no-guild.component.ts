import { DiscordGuild } from './../../../models/api.model';
import { ApiService } from './../../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-no-guild',
  templateUrl: './no-guild.component.html',
  styleUrls: ['./no-guild.component.scss']
})
export class NoGuildComponent implements OnInit {

  public id?: string;
  public readonly cdn = environment.discordCdn;
  public readonly botLink = environment.botLink;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(e => this.id = e.get("id") || undefined);
  }

  public get guild(): DiscordGuild | undefined {
    return this.api.profile?.guilds.find(el => el.id == this.id);
  }

}
