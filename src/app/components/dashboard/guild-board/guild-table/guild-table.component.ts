import { ApiService } from 'src/app/services/api.service';
import { DiscordGuild, GuildReqModel } from './../../../../models/api.model';
import { SnackbarService } from './../../../../services/snackbar.service';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guild-table',
  templateUrl: './guild-table.component.html',
  styleUrls: ['./guild-table.component.scss']
})
export class GuildTableComponent {

  @Input()
  public guild?: GuildReqModel;

  @Input()
  public discordGuild?: DiscordGuild;

  public readonly cdn = environment.discordCdn;
  public readonly columns = ["Author", "Description", "Message", "Attachments", "Enabled"];

  constructor(
    private readonly snackbar: SnackbarService,
    private readonly api: ApiService
  ) { }

  public async updateMessageState(state: boolean, msgId: string) {
    try {
      await this.api.patchMessageState(state, msgId, this.guild!.id);
      this.snackbar.snack(`Message successfully ${state ? "enabled" : "disabled"}!`);
    } catch (e) {
      const msg = this.guild!.messages.find(el => el.id === msgId);
      if (msg)
        msg.activated = !msg.activated;
      this.snackbar.snack("Ooops, impossible to update this message");
      console.error(e);
    }
  }

}
