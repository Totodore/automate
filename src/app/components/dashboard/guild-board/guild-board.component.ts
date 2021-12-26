import { checkAdminPermissions } from './../../../utils/perms.util';
import { GuildTableComponent } from './guild-table/guild-table.component';
import { SnackbarService } from './../../../services/snackbar.service';
import { environment } from './../../../../environments/environment';
import { GuildReqModel, MessageModel } from './../../../models/api.model';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  @ViewChild("table")
  public table!: GuildTableComponent;

  @ViewChild("addMessage")
  public addMessage!: GuildAddMessageComponent;

  public editMessage?: MessageModel;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService,
  ) { }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(async e => {
      this.guildId = e.get("id");
      if (this.guildId) {
        this.loading = true;
        this.discordGuild = this.api.profile?.guilds.find(el => el.id === this.guildId);
        this.guild = await this.api.getGuild(this.guildId);
        this.loading = false;
      }
    });
    this.route.queryParamMap.subscribe(e => {
      if (e.get("status") === "premium_cancel") {
        this.snackbar.snack("Ooops ! Premium subscription cancelled", 7000);
        this.router.navigate(["."], { relativeTo: this.route, queryParams: { status: null } });
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

  public get isAdmin(): boolean {
    return checkAdminPermissions(this.discordGuild?.permissions || 0);
  }

  public get isPremium(): boolean {
    return true;
  }

}
