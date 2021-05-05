import { SnackbarService } from './../../../../services/snackbar.service';
import { ApiService } from 'src/app/services/api.service';
import { GuildReqModel, DiscordGuild } from './../../../../models/api.model';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-guild-options',
  templateUrl: './guild-options.component.html',
  styleUrls: ['./guild-options.component.scss']
})
export class GuildOptionsComponent {

  public guild: GuildReqModel;
  public discordGuild: DiscordGuild;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: [DiscordGuild, GuildReqModel],
    private readonly api: ApiService,
    private readonly snackbar: SnackbarService
  ) {
    [this.discordGuild, this.guild] = data;
  }

  public async updateGuildScope() {
    try {
      await this.api.patchGuildScope(this.guild.scope, this.guild.id);
    } catch (e) {
      console.error(e);
      this.snackbar.snack("Error while trying to change guild options !");
      this.guild.scope = !this.guild.scope;
    }
  }

}
