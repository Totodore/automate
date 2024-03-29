import { checkAdminPermissions } from './../../../utils/perms.util';
import { GuildTableComponent } from './guild-table/guild-table.component';
import { SnackbarService } from './../../../services/snackbar.service';
import { environment } from './../../../../environments/environment';
import { GuildReqModel, MessageModel } from './../../../models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild("addMessage")
  public addMessage!: GuildAddMessageComponent;

  public editMessage?: MessageModel;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ApiService,
    private readonly snackback: SnackbarService,
    private readonly router: Router
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(async e => {
      this.guildId = e.get("id");
      if (this.guildId) {
        this.loading = true;
        this.discordGuild = this.api.profile?.guilds.find(el => el.id === this.guildId);
        this.guild = await this.api.getGuild(this.guildId);
        if (!this.guild) {
          this.snackback.snack("Error while getting guild infos, please retry or send a message on the #bug-report channel on Discord");
          this.router.navigateByUrl("/board");
        }
        this.isAdmin = checkAdminPermissions(this.discordGuild?.permissions || 0);
        this.loading = false;
      }
    });
  }

  /**
   * Executed when the user click on the edit button
   * That will trigger the message setter in the GuildAddMessageComponent
   * @param msg the message to be edited
   */
  public async onEditMessage(msg: MessageModel) {
    //We create a new object to avoid the cache system in angular that do not update if it has the same objectId than the previous
    this.editMessage = {...msg};  
    document.querySelector("app-guild-board")
      ?.scrollTo({ top: document.querySelector("app-guild-add-message h1")?.getBoundingClientRect()?.top, behavior: "smooth" });
  }

}
