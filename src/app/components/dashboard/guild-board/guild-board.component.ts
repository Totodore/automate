import { checkAdminPermissions } from './../../../utils/perms.util';
import { GuildTableComponent } from './guild-table/guild-table.component';
import { SnackbarService } from './../../../services/snackbar.service';
import { environment } from './../../../../environments/environment';
import { GuildReqModel, MessageModel } from './../../../models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DiscordGuild } from 'src/app/models/api.model';
import { GuildAddMessageComponent } from './guild-add-message/guild-add-message.component';

@Component({
  selector: 'app-guild-board',
  templateUrl: './guild-board.component.html',
  styleUrls: ['./guild-board.component.scss']
})
export class GuildBoardComponent implements OnInit {

  public guildId: string | null = null;
  public discordGuild?: DiscordGuild;
  public guild?: GuildReqModel;
  public readonly cdn = environment.discordCdn;
  public loading = false;
  public isAdmin = false;

  @ViewChild("table")
  public table!: GuildTableComponent;

  public editMessage?: MessageModel;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(async e => {
      this.guildId = e.get("id");
      if (this.guildId) {
        this.loading = true;
        this.discordGuild = this.api.profile?.guilds.find(el => el.id === this.guildId);
        this.guild = await this.api.getGuild(this.guildId);
        this.isAdmin = checkAdminPermissions(this.discordGuild?.permissions || 0);
        this.loading = false;
      }
    });
  }

  public async onEditMessage(msg: MessageModel) {
    this.editMessage = msg;
    document.querySelector("app-guild-board")
      ?.scrollTo({ top: document.querySelector("app-guild-add-message h1")?.getBoundingClientRect()?.top, behavior: "smooth" });
  }

}
