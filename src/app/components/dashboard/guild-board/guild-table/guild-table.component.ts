import { ApiService } from 'src/app/services/api.service';
import { DiscordGuild, GuildReqModel } from './../../../../models/api.model';
import { SnackbarService } from './../../../../services/snackbar.service';
import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-guild-table',
  templateUrl: './guild-table.component.html',
  styleUrls: ['./guild-table.component.scss']
})
export class GuildTableComponent implements OnInit {

  @Input()
  public discordGuild?: DiscordGuild;

  public guild?: GuildReqModel;
  public readonly cdn = environment.discordCdn;
  public readonly columns = ["Author", "Channel", "Description", "Message", "Attachments", "Actions"];
  public toggledRow?: string;

  constructor(
    private readonly snackbar: SnackbarService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    public readonly api: ApiService
  ) { }

  public ngOnInit(): void {
    this.refresh();
  }

  public async updateMessageState(state: boolean, msgId: string) {
    try {
      await this.api.patchMessageState(state, msgId);
      this.snackbar.snack(`Message successfully ${state ? "enabled" : "disabled"}!`);
    } catch (e) {
      const msg = this.api.currentGuild!.messages.find(el => el.id === msgId);
      if (msg)
        msg.activated = !msg.activated;
      this.snackbar.snack("Ooops, impossible to update this message");
      console.error(e);
    }
  }

  public getChannelName(id: string) {
    return this.api.currentGuild?.channels.find(el => el.id === id)?.name;
  }

  public refresh() {
    this.guild = Object.create(this.api.currentGuild!);
    this.changeDetectorRef.detectChanges();
  }
}
